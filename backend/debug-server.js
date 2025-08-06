const express = require('express');

console.log('🚀 Starting debug server...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔧 Port:', process.env.PORT);

const app = express();

// Middleware básico
app.use(express.json());

// Rutas simples
app.get('/', (req, res) => {
  console.log('📥 GET / request received');
  res.json({ message: 'Debug server working!' });
});

app.get('/health', (req, res) => {
  console.log('📥 GET /health request received');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/test', (req, res) => {
  console.log('📥 GET /test request received');
  res.json({ message: 'Test endpoint working!' });
});

// Arrancar servidor
const port = process.env.PORT || 3001;

try {
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Debug server running on port ${port}`);
    console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
    console.log('🎉 Debug server started successfully!');
  });
} catch (error) {
  console.error('❌ Failed to start debug server:', error);
  process.exit(1);
}

// Manejar errores
app.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
}); 