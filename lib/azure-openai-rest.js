export async function analyzeBillImpact(billText, pincode, demographics, pincodeData) {
  const maxRetries = 3;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      return await makeOpenAIRequest(billText, pincode, demographics, pincodeData);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        const delay = attempt * 2000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('All retries failed, using fallback data');
  return getFallbackAnalysis(pincode, demographics);
}

async function makeOpenAIRequest(billText, pincode, demographics, pincodeData) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  
  const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`;
  
  console.log('=== Azure OpenAI Request ===');
  console.log('URL:', url);
  console.log('Deployment:', deployment);
  
  const prompt = `Analyze this bill's impact on pincode ${pincode}.

BILL: ${billText}

DEMOGRAPHICS:
- Population: ${demographics.population}
- Farmers: ${demographics.farmers}
- Workers: ${demographics.workers}

Return JSON with english_summary, hindi_summary, affected_groups, impact_scores.`;

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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure API error: ${response.status}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(content);
}

function getFallbackAnalysis(pincode, demographics) {
  return {
    english_summary: `This bill will impact residents of pincode ${pincode}. It will affect ${demographics.workers} workers and ${demographics.farmers} farmers.`,
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
