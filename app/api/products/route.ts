import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('products').insert({
      name: body.name,
      description: body.description || '',
      price: body.price,
      category: body.category,
      images: body.images || [],
      stock: body.stock ?? 0,
      specs: body.specs || [],
    }).select().single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
