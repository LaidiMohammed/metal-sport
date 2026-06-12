import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const SQL = `
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

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;

export async function POST() {
  const results: { method: string; status: string; detail?: string }[] = [];

  const { data: ciCheck, error: ciErr } = await supabaseAdmin.from('check_ins').select('id').limit(1);
  const { data: asCheck, error: asErr } = await supabaseAdmin.from('admin_settings').select('key').limit(1);

  if (!ciErr && !asErr) {
    results.push({ method: 'check', status: 'ok', detail: 'Both tables already exist' });
    return NextResponse.json({ results, alreadyExists: true });
  }

  results.push({
    method: 'check',
    status: 'info',
    detail: `check_ins: ${ciErr ? `MISSING (${ciErr.message})` : 'EXISTS'}, admin_settings: ${asErr ? `MISSING (${asErr.message})` : 'EXISTS'}`,
  });

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const pg = await import('pg').then(m => m.default);
      const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
      await pool.query(SQL);
      await pool.end();
      results.push({ method: 'DATABASE_URL', status: 'ok' });
      return NextResponse.json({ results, alreadyExists: false });
    } catch (e: any) {
      results.push({ method: 'DATABASE_URL', status: 'failed', detail: e.message });
    }
  }

  return NextResponse.json({
    results,
    alreadyExists: false,
    manualSql: SQL,
    hint: 'Run the SQL above in Supabase SQL Editor at https://supabase.com/dashboard/project/anbuunmpsgsrobvccxkh/sql/new',
  });
}
