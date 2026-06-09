import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/chargily';

export async function POST(req: Request) {
  try {
    const { userId, items, membershipPlan, billing } = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const metadata: Record<string, string> = {};

    if (membershipPlan) {
      const prices: Record<string, number> = {
        'Premium/mensuel': 450000,
        'Premium/annuel': 4320000,
        'Elite/mensuel': 950000,
        'Elite/annuel': 9120000,
      };
      const key = `${membershipPlan}/${billing || 'mensuel'}`;
      const amount = prices[key];
      if (!amount) throw new Error('Invalid membership plan');

      metadata.type = 'membership';
      metadata.plan = membershipPlan;
      metadata.billing = billing || 'mensuel';

      const checkout = await createCheckout({
        amount,
        success_url: `${origin}/receipt`,
        failure_url: `${origin}/membership?payment=failed`,
        webhook_endpoint: `${origin}/api/chargily/webhook`,
        locale: 'fr',
        metadata: { ...metadata, userId: userId || '' },
      });

      return NextResponse.json({ url: checkout.url, id: checkout.id });
    }

    if (items && items.length > 0) {
      const totalCentimes = items.reduce((s: number, i: any) => s + Math.round(i.price * 100) * i.quantity, 0);

      metadata.type = 'order';
      metadata.items = JSON.stringify(items.map((i: any) => ({ id: i.id || i.product_id, name: i.name, qty: i.quantity, price: i.price })));

      const checkout = await createCheckout({
        amount: totalCentimes,
        success_url: `${origin}/receipt`,
        failure_url: `${origin}/checkout?payment=failed`,
        webhook_endpoint: `${origin}/api/chargily/webhook`,
        locale: 'fr',
        metadata: { ...metadata, userId: userId || '' },
      });

      return NextResponse.json({ url: checkout.url, id: checkout.id });
    }

    throw new Error('Missing membershipPlan or items');
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
