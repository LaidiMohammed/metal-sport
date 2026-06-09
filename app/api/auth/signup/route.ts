import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { email, password, name, lastName, code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 });
    }

    // Fetch stored code
    const { data: stored, error: fetchError } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !stored) {
      return NextResponse.json({ error: 'No verification code found. Request a new one.' }, { status: 400 });
    }

    // Check expiry
    if (new Date(stored.expires_at) < new Date()) {
      await supabaseAdmin.from('verification_codes').delete().eq('email', email);
      return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 });
    }

    // Check attempts
    if (stored.attempts >= 3) {
      await supabaseAdmin.from('verification_codes').delete().eq('email', email);
      return NextResponse.json({ error: 'Too many failed attempts. Request a new code.' }, { status: 400 });
    }

    // Verify code
    if (stored.code !== code) {
      await supabaseAdmin.from('verification_codes').update({ attempts: stored.attempts + 1 }).eq('id', stored.id);
      const remaining = 2 - stored.attempts;
      return NextResponse.json({ error: `Incorrect code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.` }, { status: 400 });
    }

    // Code verified — delete it
    await supabaseAdmin.from('verification_codes').delete().eq('email', email);

    // Create user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, lastName },
    });

    if (authError) throw authError;

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      name: name || email.split('@')[0],
      last_name: lastName || '',
      email,
      role: 'user',
    });

    if (profileError) throw profileError;

    return NextResponse.json({ user: authData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
