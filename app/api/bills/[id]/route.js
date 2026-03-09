import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase.js';

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const { data: bill, error } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ bill });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
