const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://anbuunmpsgsrobvccxkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYnV1bm1wc2dzcm9idmNjeGtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk0MDQ5NiwiZXhwIjoyMDk2NTE2NDk2fQ.VJGleLLVrB8afx92JMOk0fv1B1mJ655CVE_K_KOsx3Q',
  { auth: { autoRefreshToken: false, persistSession: false } }
});

async function main() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error('list error', error); process.exit(1); }

  for (const u of users) {
    if (u.email === 'hamada.laidi.14@gmail.com') continue;
    console.log(`User: ${u.email} (${u.id})`);

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', u.id).single();
    if (profile) {
      console.log(`  Profile: name=${profile.name}, membership=${profile.membership}, isActive=${profile.is_active}`);
      console.log(`  age=${profile.age}, height=${profile.height}, weight=${profile.weight}, sex=${profile.sex}`);
    } else {
      console.log(`  No profile found`);
    }
  }
}
main();
