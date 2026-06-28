import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const PLACEHOLDER_BASE = 'https://placehold.co/400x400/1a1a2e/00d4aa';

const productImages: Record<string, string> = {
  'Whey Protein Gold': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Whey+Protein',
  'Creatine Monohydrate': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Creatine',
  'Haltères Réglables 20kg': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Haltères',
  'Barre de Curl EZ': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Barre+EZ',
  'Abonnement Mensuel': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Mensuel',
  'Abonnement Annuel': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Annuel',
  "T-Shirt Kimo's Gym": 'https://placehold.co/400x400/1a1a2e/00d4aa?text=T-Shirt',
  'Gourde Aluminum 1L': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Gourde',
  'Pack Coaching + Salle': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Coaching',
  'Élastiques de Résistance': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Élastiques',
  'Mass Gainer 3kg': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Mass+Gainer',
  'Tapis de Yoga': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Tapis+Yoga',
  'Short de Sport': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Short',
  'Casquette Gym': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Casquette',
  'Sac de Sport 40L': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Sac+40L',
  'Abonnement 3 Mois': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=3+Mois',
  'Bandes de Poignet': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Bandes',
  'Abonnement Journalier': 'https://placehold.co/400x400/1a1a2e/00d4aa?text=Journalier',
};

export async function GET() {
  try {
    const { data: products, error: fetchErr } = await supabaseAdmin.from('products').select('id, name, images');
    if (fetchErr) throw fetchErr;

    let updated = 0;
    for (const product of products || []) {
      const imgUrl = productImages[product.name];
      if (imgUrl) {
        const { error: updateErr } = await supabaseAdmin
          .from('products')
          .update({ images: [imgUrl] })
          .eq('id', product.id);
        if (updateErr) throw updateErr;
        updated++;
      }
    }

    return NextResponse.json({ status: 'ok', updated, total: products?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
