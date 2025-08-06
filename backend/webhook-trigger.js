const https = require('https');

console.log('🚀 Triggering Railway webhook...');

// Railway webhook URL (necesitarás obtenerla de Railway)
const webhookUrl = process.env.RAILWAY_WEBHOOK_URL || 'https://api.railway.app/webhook';

const payload = JSON.stringify({
  event: 'push',
  repository: {
    name: 'OliviaCafeteria',
    full_name: 'P4ul4f/OliviaCafeteria'
  },
  ref: 'refs/heads/main',
  commits: [
    {
      id: 'bdf47a8',
      message: 'URGENT: Add deployment status README to force Railway detection',
      timestamp: new Date().toISOString()
    }
  ]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(webhookUrl, options, (res) => {
  console.log(`📡 Webhook response: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`📡 Response: ${chunk}`);
  });
});

req.on('error', (err) => {
  console.error(`❌ Webhook error: ${err.message}`);
});

req.write(payload);
req.end();

console.log('✅ Webhook triggered successfully'); 