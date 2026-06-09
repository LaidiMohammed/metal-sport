import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.type;

    if (eventType === 'checkout.paid' && body.data) {
      const checkout = body.data;
      const metadata = checkout.metadata || {};

      if (metadata.type === 'membership') {
        const userId = metadata.userId;
        if (userId && (metadata.plan === 'Premium' || metadata.plan === 'Elite')) {
          const membership = metadata.plan === 'Premium' ? 'premium' : 'elite';
          const billing = metadata.billing || 'mensuel';
          const expirationDate = billing === 'annuel'
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          await supabaseAdmin.from('profiles').update({
            membership,
            expiration_date: expirationDate,
          }).eq('id', userId);
        }
      }

      if (metadata.type === 'order') {
        const userId = metadata.userId;
        let items: any[] = [];
        try { items = JSON.parse(metadata.items || '[]'); } catch {}

        if (userId && items.length > 0) {
          const total = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
          await supabaseAdmin.from('orders').insert({
            user_id: userId,
            total,
            status: 'confirmed',
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
