const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});

// Start server
const port = process.env.PORT || 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Express server running on port ${port}`);
  console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
  console.log('🎉 Express server started successfully!');
});

app.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
}); 