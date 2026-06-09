import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/verification-token';

export async function POST(req: Request) {
  try {
    const { email, password, name, lastName, code, token, age, height, weight, gymLevel } = await req.json();
    if (!code || !token) {
      return NextResponse.json({ error: 'Verification code and token required' }, { status: 400 });
    }

    const result = verifyToken(token, email, code);
    if (!result.valid) {
      return NextResponse.json({ error: result.reason || 'Verification failed' }, { status: 400 });
    }

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
      age: age || null,
      height: height || null,
      weight: weight || null,
      sex: gymLevel === 'never' || gymLevel === 'beginner' ? 'other' : 'male',
    });

    if (profileError) throw profileError;

    return NextResponse.json({ user: authData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
