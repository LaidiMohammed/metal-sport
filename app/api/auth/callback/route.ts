import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { userId, email, name } = await req.json();

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existing) {
      const nameParts = (name || email?.split('@')[0] || 'User').split(' ');
      await supabaseAdmin.from('profiles').insert({
        id: userId,
        name: nameParts[0],
        last_name: nameParts.slice(1).join(' ') || '',
        email: email || '',
        role: 'user',
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
