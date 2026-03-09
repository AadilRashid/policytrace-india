import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase.js';

export async function POST(request) {
  const { phone, pincode, topics } = await request.json();
  
  const { data, error } = await supabase
    .from('alerts')
    .insert({
      phone,
      pincode,
      topics: topics || [],
      active: true
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, alert: data });
}
