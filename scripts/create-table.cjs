require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // Try creating a pg_query function first
  const { error: fnError } = await supabase.rpc('pg_query', {
    query: `CREATE TABLE IF NOT EXISTS verification_codes (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      email text NOT NULL,
      code text NOT NULL,
      attempts integer DEFAULT 0,
      expires_at timestamptz NOT NULL,
      created_at timestamptz DEFAULT now()
    );`
  });
  
  if (fnError) {
    console.log('pg_query RPC not available:', fnError.message);
    
    // Try exec_sql
    const { error: exError } = await supabase.rpc('exec_sql', {
      sql_text: `CREATE TABLE IF NOT EXISTS verification_codes (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        email text NOT NULL,
        code text NOT NULL,
        attempts integer DEFAULT 0,
        expires_at timestamptz NOT NULL,
        created_at timestamptz DEFAULT now()
      );`
    });
    
    if (exError) {
      console.log('exec_sql RPC not available:', exError.message);
      console.log('\nPlease run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/anbuunmpsgsrobvccxkh/sql):\n');
      console.log(`CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code text NOT NULL,
  attempts integer DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);`);
      process.exit(1);
    } else {
      console.log('Table created via exec_sql!');
    }
  } else {
    console.log('Table created via pg_query!');
  }
}

run().catch(console.error);
