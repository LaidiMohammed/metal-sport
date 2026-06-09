-- ============================================================
-- KIMO'S GYM APP - Supabase Schema
-- Execute this in Supabase SQL Editor
-- ============================================================

-- 7. Check-ins (attendance / door access log)
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  membership TEXT,
  status TEXT NOT NULL DEFAULT 'granted',
  door_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admin settings (key-value storage)
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Profiles (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  membership TEXT DEFAULT 'free' CHECK (membership IN ('free', 'premium', 'elite')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  is_spam BOOLEAN DEFAULT false,
  height NUMERIC,
  weight NUMERIC,
  age INTEGER,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')),
  avatar TEXT,
  sessions_left INTEGER DEFAULT 30,
  expiration_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
  revenue NUMERIC DEFAULT 0,
  join_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('complements', 'materiel', 'abonnement', 'vetements', 'accessoires')),
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  specs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL
);

-- 5. Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  reps INTEGER DEFAULT 0,
  weight NUMERIC,
  duration INTEGER,
  date TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT false
);

-- 6. Coach Messages (optional, for history)
CREATE TABLE coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- Profiles: users can read/update own profile, admins can read all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Products: public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders: users see own, admins see all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can read all order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Workout Sessions
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Seed Data
-- ============================================================

-- Create default admin profile (make sure to create auth user first)
-- Run this AFTER creating the admin user in auth

-- Products
INSERT INTO products (name, description, price, category, images, stock, specs) VALUES
  ('Whey Protein Gold', '100% pure whey protein isolate. 25g protein per serving.', 4500, 'complements', ARRAY['https://images.unsplash.com/photo-1593095948071-474c5cc2c1cf?w=400'], 50, ARRAY['25g protein', '2.5g carbs', 'Vanilla/Chocolate', '2kg tub']),
  ('Creatine Monohydrate', 'Micronized creatine monohydrate for maximum strength.', 2800, 'complements', ARRAY['https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400'], 30, ARRAY['Micronized', 'Unflavored', '500g']),
  ('Haltères Réglables 20kg', 'Set d''haltères réglables en acier chromé.', 15000, 'materiel', ARRAY['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400'], 15, ARRAY['Acier chromé', '2-20kg', 'Paire']),
  ('Barre de Curl EZ', 'Barre EZ professionnelle pour curls.', 5500, 'materiel', ARRAY['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400'], 20, ARRAY['Acier trempé', '120cm', 'Ergonomique']),
  ('Abonnement Mensuel', 'Accès illimité à la salle. Cours collectifs inclus.', 4500, 'abonnement', ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'], 999, ARRAY['Accès illimité', 'Cours collectifs']),
  ('Abonnement Annuel', 'Notre meilleur rapport qualité-prix. 2 mois offerts.', 42000, 'abonnement', ARRAY['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400'], 999, ARRAY['Économisez 35%', 'Coaching offert']),
  ('T-Shirt Kimo''s Gym', 'T-shirt en coton bio premium. Logo brodé.', 2500, 'vetements', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'], 60, ARRAY['Coton bio', 'Logo brodé']),
  ('Gourde Aluminum 1L', 'Gourde en aluminium isolée. Garde au froid 24h.', 1800, 'accessoires', ARRAY['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'], 80, ARRAY['Aluminium', '1L', 'Isolée 24h']),
  ('Pack Coaching + Salle', 'Abonnement + 8 séances coaching personnel.', 12000, 'abonnement', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], 50, ARRAY['8 séances coaching', 'Plan sur mesure']),
  ('Élastiques de Résistance', 'Set de 5 élastiques de résistance.', 2500, 'materiel', ARRAY['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'], 40, ARRAY['5 niveaux', 'Latex', 'Lot de 5']);
