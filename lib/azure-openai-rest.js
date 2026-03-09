// Alternative Azure OpenAI implementation using direct REST API

export async function analyzeBillImpact(billText, pincode, demographics, pincodeData) {
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
      return await makeOpenAIRequest(billText, pincode, demographics, pincodeData);
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        const delay = attempt * 2000;
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('❌ All retries failed, using fallback data');
  return getFallbackAnalysis(pincode, demographics);
}

async function makeOpenAIRequest(billText, pincode, demographics, pincodeData) {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    
    const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`;
    
    console.log('=== Azure OpenAI Request ===');
    console.log('URL:', url);
    console.log('Deployment:', deployment);
    console.log('API Key:', apiKey ? 'Present (***' + apiKey.slice(-4) + ')' : 'MISSING');
    
    const prompt = `You are a policy analyst for PolicyTrace India. Analyze this bill's impact on pincode ${pincode}.

BILL SUMMARY:
${billText}

LOCAL DEMOGRAPHICS:
- Area: ${pincodeData.area}, ${pincodeData.district}, ${pincodeData.state}
- Population: ${demographics.population}
- Farmers: ${demographics.farmers}
- Workers: ${demographics.workers}
- Students: ${demographics.students}
- Businesses: ${demographics.businesses}
- Average Income: ₹${demographics.avg_income}/month
- Literacy Rate: ${demographics.literacy_rate}%

Provide SPECIFIC, ACTIONABLE analysis:

1. WHO is affected: Name specific groups (daily wage workers, small farmers, street vendors, etc.)
2. HOW they're affected: Concrete changes (new benefits, costs, requirements)
3. WHEN: Implementation timeline with key dates
4. WHAT TO DO: Specific actions residents should take (register, apply, prepare documents)
5. MONEY IMPACT: Actual rupee amounts (benefits, costs, savings)

Return JSON:
{
  "english_summary": "Detailed 3-4 sentence summary with specific numbers and actions",
  "hindi_summary": "विस्तृत 3-4 वाक्य सारांश विशिष्ट संख्याओं और कार्यों के साथ",
  "affected_groups": [
    {"group": "Daily wage workers", "impact": "Will receive ₹X/month pension", "action": "Register at nearest labor office by DATE"},
    {"group": "Small farmers", "impact": "Eligible for crop insurance", "action": "Apply online with land records"}
  ],
  "financial_impact": {
    "benefits": "₹X per month for eligible workers",
    "costs": "₹Y registration fee",
    "net_impact": "Average family saves ₹Z annually"
  },
  "timeline": {
    "announcement": "Date",
    "registration_opens": "Date",
    "implementation": "Date",
    "first_benefits": "Date"
  },
  "action_steps": [
    "Step 1: Specific action with deadline",
    "Step 2: Where to go, what documents needed",
    "Step 3: How to check eligibility"
  ],
  "impact_scores": {
    "farmers": 8,
    "workers": 7,
    "students": 4,
    "businesses": 6
  }
}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.4
      }),
      signal: AbortSignal.timeout(30000)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI API error:', response.status, errorText);
      throw new Error(`Azure API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Azure OpenAI SUCCESS');
    let content = data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(content);
    
  } catch (error) {
    throw error;
  }
}

function getFallbackAnalysis(pincode, demographics) {
  return {
    english_summary: `This bill will impact residents of pincode ${pincode}. Based on the demographics, it will affect ${demographics.workers} workers and ${demographics.farmers} farmers in the area.`,
    hindi_summary: `यह विधेयक पिनकोड ${pincode} के निवासियों को प्रभावित करेगा।`,
    impact_scores: {
      farmers: demographics.farmers > 5000 ? 8 : 3,
      workers: demographics.workers > 20000 ? 7 : 4,
      students: demographics.students > 8000 ? 6 : 3,
      businesses: demographics.businesses > 5000 ? 7 : 4
    },
    timeline: 'Implementation expected within 6-12 months'
  };
}
