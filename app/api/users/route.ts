import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', adminUser.id)
      .maybeSingle();

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, lastName, email, membership, age, sex, height, weight, sessionsLeft, expirationDate, revenue } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    const tempPassword = Math.random().toString(36).slice(2) + 'Aa1!';

    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name, lastName },
    });

    if (createError) throw createError;

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      name,
      last_name: lastName || '',
      email,
      role: 'user',
      membership: membership || 'free',
      is_active: true,
      age: age || null,
      sex: sex || null,
      height: height || null,
      weight: weight || null,
      sessions_left: sessionsLeft || 30,
      expiration_date: expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      revenue: revenue || 0,
    });

    if (profileError) throw profileError;

    return NextResponse.json({
      user: {
        id: authData.user.id,
        name,
        lastName: lastName || '',
        email,
        membership: membership || 'free',
        role: 'user',
        isActive: true,
        isSpam: false,
        age: age || null,
        sex: sex || null,
        height: height || null,
        weight: weight || null,
        sessionsLeft: sessionsLeft || 30,
        expirationDate: expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        revenue: revenue || 0,
        joinDate: new Date().toISOString(),
      },
      tempPassword,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

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

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const users = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      lastName: p.last_name || '',
      email: p.email,
      membership: p.membership,
      role: p.role,
      isActive: p.is_active,
      isSpam: p.is_spam,
      height: p.height,
      weight: p.weight,
      age: p.age,
      sex: p.sex,
      joinDate: p.join_date,
      revenue: p.revenue,
      sessionsLeft: p.sessions_left,
      expirationDate: p.expiration_date,
      avatar: p.avatar,
    }));

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
