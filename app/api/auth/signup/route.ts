import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/verification-token';
import { validateEmail, validatePassword, validateName, sanitizeString, validateAge, validateHeight, validateWeight } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: rawEmail, password: rawPass, name: rawName, lastName: rawLast, code, token, age, height, weight, gymLevel } = body;

    if (!code || !token) {
      return NextResponse.json({ error: 'Verification code and token required' }, { status: 400 });
    }

    const email = sanitizeString(rawEmail || '');
    const password = rawPass || '';
    const name = sanitizeString(rawName || '');
    const lastName = sanitizeString(rawLast || '');

    const err = validateEmail(email) || validatePassword(password) || validateName(name, 'Name');
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    if (lastName && validateName(lastName, 'Last name')) {
      return NextResponse.json({ error: validateName(lastName, 'Last name') }, { status: 400 });
    }
    if (age) { const e = validateAge(age); if (e) return NextResponse.json({ error: e }, { status: 400 }); }
    if (height) { const e = validateHeight(height); if (e) return NextResponse.json({ error: e }, { status: 400 }); }
    if (weight) { const e = validateWeight(weight); if (e) return NextResponse.json({ error: e }, { status: 400 }); }

    const result = verifyToken(token, email, code);
    if (!result.valid) {
      return NextResponse.json({ error: result.reason || 'Verification failed' }, { status: 400 });
    }

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
