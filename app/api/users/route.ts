import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
