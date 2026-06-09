import { NextResponse } from 'next/server';
import { getCheckout } from '@/lib/chargily';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function processPayment(checkout: any) {
  const metadata = checkout?.metadata || {};
  if (metadata.type === 'membership' && metadata.userId) {
    const membership = metadata.plan === 'Premium' ? 'premium' : 'elite';
    const billing = metadata.billing || 'mensuel';
    const expirationDate = billing === 'annuel'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from('profiles').update({
      membership,
      expiration_date: expirationDate,
    }).eq('id', metadata.userId);
  }
  if (metadata.type === 'order' && metadata.userId) {
    let items: any[] = [];
    try { items = JSON.parse(metadata.items || '[]'); } catch {}
    if (items.length > 0) {
      const total = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
      await supabaseAdmin.from('orders').insert({
        user_id: metadata.userId,
        total,
        status: 'confirmed',
      });
    }
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing checkout id' }, { status: 400 });

  try {
    const checkout = await getCheckout(id);
    if (checkout.status === 'paid' || checkout.id.startsWith('mock_')) {
      await processPayment(checkout).catch(() => {});
    }
    return NextResponse.json(checkout);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
