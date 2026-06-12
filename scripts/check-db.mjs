import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ref = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Check if tables exist first
const { data: ci } = await supabase.from('check_ins').select('id').limit(1);
const { data: as } = await supabase.from('admin_settings').select('key').limit(1);
console.log('check_ins:', ci ? 'EXISTS' : 'MISSING');
console.log('admin_settings:', as ? 'EXISTS' : 'MISSING');

// Try Supabase's own SQL endpoint
const sql = `CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  membership TEXT,
  status TEXT NOT NULL DEFAULT 'granted',
  door_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

console.log('\nTrying internal SQL endpoint...');
try {
  const resp = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apiKey': serviceRoleKey,
      'Content-Type': 'application/json',
      'Prefer': 'params=single-object',
    },
    body: JSON.stringify({ query: sql }),
  });
  console.log('Status:', resp.status);
  const text = await resp.text();
  console.log('Response:', text.substring(0, 500));
} catch (e) {
  console.log('Endpoint not available:', e.message);
}

// Try Management API endpoint with a different approach
console.log('\nTrying /rest/v1/rpc/...');
try {
  const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_typeof`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apiKey': serviceRoleKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  console.log('Status:', resp.status);
  const text = await resp.text();
  console.log('Response:', text.substring(0, 500));
} catch (e) {
  console.log('RPC endpoint error:', e.message);
}
