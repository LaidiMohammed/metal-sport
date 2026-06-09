const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://anbuunmpsgsrobvccxkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYnV1bm1wc2dzcm9idmNjeGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk0MDQ5NiwiZXhwIjoyMDk2NTE2NDk2fQ.VJGleLLVrB8afx92JMOk0fv1B1mJ655CVE_K_KOsx3Q',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error('list error', error); process.exit(1); }

  const toDelete = users.filter(u => u.email !== 'hamada.laidi.14@gmail.com');
  console.log(`Found ${users.length} users, deleting ${toDelete.length}...`);

  for (const u of toDelete) {
    const { error } = await supabase.auth.admin.deleteUser(u.id);
    console.log(error ? `FAIL ${u.email}: ${error.message}` : `OK ${u.email}`);
  }
  console.log('Done');
}
main();
