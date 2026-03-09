import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  
  let query = supabase.from('bills').select('*');
  
  if (status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('introduced_date', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ bills: data });
}
