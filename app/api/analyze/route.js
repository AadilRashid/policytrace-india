import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase.js';
import { analyzeBillImpact } from '../../../lib/azure-openai-rest.js';
import { getPincodeData } from '../../../lib/pincode-data.js';

export async function POST(request) {
  try {
    const { billId, pincode } = await request.json();
    
    const { data: bill } = await supabase
      .from('bills')
      .select('*')
      .eq('id', billId)
      .single();
    
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    
    const pincodeData = await getPincodeData(pincode);
    
    const analysis = await analyzeBillImpact(
      bill.summary,
      pincode,
      pincodeData.demographics,
      pincodeData
    );
    
    await supabase.from('impact_analyses').insert({
      bill_id: billId,
      pincode,
      analysis: analysis
    });
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: 'Failed to analyze bill impact'
    }, { status: 500 });
  }
}
