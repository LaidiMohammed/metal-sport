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
