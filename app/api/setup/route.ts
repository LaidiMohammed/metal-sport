import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST() {
  const results: { step: string; status: string; error?: string }[] = [];

  // 1. Create admin user in Auth
  const { data: existingAdmin } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', 'mutd3705@gmail.com')
    .maybeSingle();

  if (!existingAdmin) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'mutd3705@gmail.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: { name: 'Hamada', lastName: 'Admin' },
    });

    if (authError) {
      results.push({ step: 'Create admin auth user', status: 'error', error: authError.message });
    } else {
      results.push({ step: 'Create admin auth user', status: 'ok' });

      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: authData.user.id,
        name: 'Hamada',
        last_name: 'Admin',
        email: 'mutd3705@gmail.com',
        role: 'admin',
        membership: 'elite',
      });

      if (profileError) {
        results.push({ step: 'Create admin profile', status: 'error', error: profileError.message });
      } else {
        results.push({ step: 'Create admin profile', status: 'ok' });
      }
    }
  } else {
    results.push({ step: 'Admin already exists', status: 'skipped' });
  }

  // 2. Seed products (only if table is empty)
  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (count === 0) {
    const products = [
      { name: 'Whey Protein Gold', description: '100% pure whey protein isolate. 25g protein per serving.', price: 4500, category: 'complements', images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2c1cf?w=400'], stock: 50, specs: ['25g protein', '2.5g carbs', 'Vanilla/Chocolate', '2kg tub'] },
      { name: 'Creatine Monohydrate', description: 'Micronized creatine monohydrate for maximum strength.', price: 2800, category: 'complements', images: ['https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400'], stock: 30, specs: ['Micronized', 'Unflavored', '500g'] },
      { name: 'Haltères Réglables 20kg', description: "Set d'haltères réglables en acier chromé.", price: 15000, category: 'materiel', images: ['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400'], stock: 15, specs: ['Acier chromé', '2-20kg', 'Paire'] },
      { name: "Barre de Curl EZ", description: 'Barre EZ professionnelle pour curls.', price: 5500, category: 'materiel', images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400'], stock: 20, specs: ['Acier trempé', '120cm', 'Ergonomique'] },
      { name: 'Abonnement Mensuel', description: 'Accès illimité à la salle. Cours collectifs inclus.', price: 4500, category: 'abonnement', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'], stock: 999, specs: ['Accès illimité', 'Cours collectifs'] },
      { name: 'Abonnement Annuel', description: 'Notre meilleur rapport qualité-prix. 2 mois offerts.', price: 42000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400'], stock: 999, specs: ['Économisez 35%', 'Coaching offert'] },
      { name: "T-Shirt Kimo's Gym", description: 'T-shirt en coton bio premium. Logo brodé.', price: 2500, category: 'vetements', images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'], stock: 60, specs: ['Coton bio', 'Logo brodé'] },
      { name: 'Gourde Aluminum 1L', description: 'Gourde en aluminium isolée. Garde au froid 24h.', price: 1800, category: 'accessoires', images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'], stock: 80, specs: ['Aluminium', '1L', 'Isolée 24h'] },
      { name: 'Pack Coaching + Salle', description: 'Abonnement + 8 séances coaching personnel.', price: 12000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], stock: 50, specs: ['8 séances coaching', 'Plan sur mesure'] },
      { name: 'Élastiques de Résistance', description: 'Set de 5 élastiques de résistance.', price: 2500, category: 'materiel', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'], stock: 40, specs: ['5 niveaux', 'Latex', 'Lot de 5'] },
      { name: 'Mass Gainer 3kg', description: 'Mass gainer haute calorie 3kg. 1000 calories par portion.', price: 5500, category: 'complements', images: ['https://images.unsplash.com/photo-1612026364996-58b9f2c4f7e5?w=400'], stock: 25, specs: ['1000 cal', '50g protein', 'Chocolate', '3kg'] },
      { name: 'Tapis de Yoga', description: 'Tapis de yoga antidérapant 6mm épaisseur.', price: 3500, category: 'materiel', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'], stock: 35, specs: ['6mm', 'Antidérapant', '183x61cm'] },
      { name: 'Short de Sport', description: 'Short de sport léger et respirant.', price: 2000, category: 'vetements', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'], stock: 45, specs: ['Polyester', 'Taille élastique', 'Noir'] },
      { name: 'Casquette Kimo\'s Gym', description: 'Casquette ajustable logo brodé.', price: 1500, category: 'vetements', images: ['https://images.unsplash.com/photo-1577803645773-f964ec0967d8?w=400'], stock: 70, specs: ['Ajustable', 'Logo brodé', 'Noir/Blanc'] },
      { name: 'Sac de Sport 40L', description: 'Grand sac de sport imperméable 40L.', price: 4000, category: 'accessoires', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'], stock: 30, specs: ['40L', 'Imperméable', 'Compartiment chaussures'] },
      { name: 'Abonnement 3 Mois', description: 'Abonnement trimestriel. 1 mois offert !', price: 11000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400'], stock: 999, specs: ['3 mois', '1 mois offert', 'Cours inclus'] },
      { name: 'Bandes de Poignet', description: 'Bandes de maintien pour poignet. Lot de 2.', price: 1200, category: 'accessoires', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'], stock: 100, specs: ['Lot de 2', 'Néoprène', 'Ajustable'] },
      { name: 'Abonnement Journalier', description: 'Pass journée. Accès complet à la salle.', price: 300, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400'], stock: 999, specs: ['1 jour', 'Accès complet'] },
    ];

    const { error: seedError } = await supabaseAdmin.from('products').insert(products);

    if (seedError) {
      results.push({ step: 'Seed products', status: 'error', error: seedError.message });
    } else {
      results.push({ step: 'Seed products', status: 'ok', error: `${products.length} products inserted` });
    }
  } else {
    results.push({ step: 'Products already seeded', status: 'skipped', error: `${count} products exist` });
  }

  return NextResponse.json({ results });
}
