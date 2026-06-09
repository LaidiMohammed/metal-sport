const { createClient } = require("@supabase/supabase-js");
const s = createClient(
  "https://anbuunmpsgsrobvccxkh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYnV1bm1wc2dzcm9idmNjeGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk0MDQ5NiwiZXhwIjoyMDk2NTE2NDk2fQ.VJGleLLVrB8afx92JMOk0fv1B1mJ655CVE_K_KOsx3Q",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const sql = `CREATE TABLE IF NOT EXISTS check_ins (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, name TEXT NOT NULL, email TEXT NOT NULL, membership TEXT, status TEXT NOT NULL DEFAULT ${"'"}+granted+${"'"}, door_triggered BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW()); CREATE TABLE IF NOT EXISTS admin_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`;

  console.log("Run this SQL in Supabase SQL Editor:");
  console.log(sql);
}
main();
