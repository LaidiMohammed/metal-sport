import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const total = body.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({ user_id: body.user_id, total })
      .select()
      .single();

    if (orderError) throw orderError;

    const items = body.items.map((i: any) => ({
      order_id: order.id,
      product_id: i.product_id || i.id,
      quantity: i.quantity,
      price: i.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(items);

    if (itemsError) throw itemsError;

    return NextResponse.json({ order, items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
