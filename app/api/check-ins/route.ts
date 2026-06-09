import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { user_id, name, email, membership, door_url } = await req.json();
    if (!user_id || !name) {
      return NextResponse.json({ error: 'user_id and name required' }, { status: 400 });
    }

    const { data: checkin, error } = await supabaseAdmin.from('check_ins').insert({
      user_id,
      name,
      email: email || '',
      membership: membership || 'free',
      status: 'granted',
      door_triggered: false,
    }).select().single();

    if (error) throw error;

    let doorTriggered = false;
    if (door_url) {
      try {
        await fetch(door_url, { method: 'GET', signal: AbortSignal.timeout(3000) });
        doorTriggered = true;
        await supabaseAdmin.from('check_ins').update({ door_triggered: true }).eq('id', checkin.id);
      } catch {}
    }

    return NextResponse.json({ checkin: { ...checkin, door_triggered: doorTriggered } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
    const userId = searchParams.get('userId');

    let query = supabaseAdmin.from('check_ins').select('*').order('created_at', { ascending: false }).limit(limit);
    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
