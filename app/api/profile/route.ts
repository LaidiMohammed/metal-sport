import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sanitizeString, validateName, validateAge, validateHeight, validateWeight } from '@/lib/validation';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ profile: null });
    }
    return NextResponse.json({
      profile: {
        id: data.id,
        name: data.name,
        lastName: data.last_name || '',
        email: data.email,
        membership: data.membership,
        role: data.role,
        isActive: data.is_active,
        isSpam: data.is_spam,
        height: data.height,
        weight: data.weight,
        age: data.age,
        sex: data.sex,
        joinDate: data.join_date,
        revenue: data.revenue,
        sessionsLeft: data.sessions_left,
        expirationDate: data.expiration_date,
        avatar: data.avatar,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const name = body.name !== undefined ? sanitizeString(body.name) : undefined;
    const lastName = body.lastName !== undefined ? sanitizeString(body.lastName) : undefined;

    if (name !== undefined) { const e = validateName(name, 'Name'); if (e) return NextResponse.json({ error: e }, { status: 400 }); }
    if (lastName !== undefined && lastName) { const e = validateName(lastName, 'Last name'); if (e) return NextResponse.json({ error: e }, { status: 400 }); }
    if (body.age !== undefined) { const e = validateAge(body.age); if (e) return NextResponse.json({ error: e }, { status: 400 }); }
    if (body.height !== undefined) { const e = validateHeight(body.height); if (e) return NextResponse.json({ error: e }, { status: 400 }); }
    if (body.weight !== undefined) { const e = validateWeight(body.weight); if (e) return NextResponse.json({ error: e }, { status: 400 }); }

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (lastName !== undefined) updates.last_name = lastName;
    if (body.height !== undefined) updates.height = Number(body.height);
    if (body.weight !== undefined) updates.weight = Number(body.weight);
    if (body.age !== undefined) updates.age = Number(body.age);
    if (body.sex !== undefined) updates.sex = ['male', 'female', 'other'].includes(body.sex) ? body.sex : 'other';

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
