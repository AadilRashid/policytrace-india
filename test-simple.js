const https = require('https');
require('dotenv').config({ path: '.env.local' });

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

console.log('Testing Azure OpenAI connection...\n');
console.log('Endpoint:', endpoint);
console.log('Deployment:', deployment);
console.log('API Key:', apiKey ? '***' + apiKey.slice(-4) : 'NOT SET');
console.log('\n');

const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`;

const data = JSON.stringify({
  messages: [{ role: "user", content: "Say hello" }],
  max_tokens: 10
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': apiKey,
    'Content-Length': data.length
  }
};

console.log('Sending request to:', url);
console.log('\n');

const urlObj = new URL(url);
const req = https.request({
  hostname: urlObj.hostname,
  path: urlObj.pathname + urlObj.search,
  ...options
}, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS! Azure OpenAI is working.');
    } else {
      console.log('\n❌ ERROR! Check the response above.');
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection Error:', error.message);
});

req.write(data);
req.end();
