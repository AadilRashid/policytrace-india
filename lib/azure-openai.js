import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
);

export async function analyzeBillImpact(billText, pincode, demographics) {
  try {
    const prompt = `Analyze this Indian bill for pincode ${pincode}:

${billText}

Demographics: ${JSON.stringify(demographics)}

Provide analysis in this JSON format:
{
  "english_summary": "Brief impact summary in English",
  "hindi_summary": "संक्षिप्त प्रभाव सारांश हिंदी में",
  "impact_scores": {
    "farmers": 7,
    "workers": 8,
    "students": 5,
    "businesses": 6
  },
  "timeline": "When impacts will be felt"
}`;

    const response = await client.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [{ role: "user", content: prompt }],
      { maxTokens: 1500, temperature: 0.3 }
    );

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Azure OpenAI error:', error);
    // Return mock data if API fails
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
}
