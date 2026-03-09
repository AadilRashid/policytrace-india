import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAzureOpenAI() {
  console.log('Testing Azure OpenAI connection...\n');
  
  console.log('Configuration:');
  console.log('Endpoint:', process.env.AZURE_OPENAI_ENDPOINT);
  console.log('Deployment:', process.env.AZURE_OPENAI_DEPLOYMENT_NAME);
  console.log('API Key:', process.env.AZURE_OPENAI_API_KEY ? '***' + process.env.AZURE_OPENAI_API_KEY.slice(-4) : 'NOT SET');
  console.log('\n');

  try {
    const client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
    );

    console.log('Sending test request...');
    
    const response = await client.getChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      [{ role: "user", content: "Say hello in one word" }],
      { maxTokens: 10 }
    );

    console.log('✅ SUCCESS!');
    console.log('Response:', response.choices[0].message.content);
    
  } catch (error) {
    console.log('❌ ERROR:');
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    console.log('Status:', error.statusCode);
    console.log('\nFull error:', error);
  }
}

testAzureOpenAI();
