import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase.js';
import { scrapePRSBills } from '../../../lib/prs-scraper.js';

export async function POST(request) {
  try {
    console.log('Fetching bills from PRS Legislative Research...');
    const bills = await scrapePRSBills();
    
    console.log(`Found ${bills.length} bills`);
    
    let synced = 0;
    for (const bill of bills) {
      const { error } = await supabase
        .from('bills')
        .upsert(bill, { onConflict: 'id' });
      
      if (!error) synced++;
    }
    
    return NextResponse.json({ 
      success: true,
      synced,
      total: bills.length 
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
