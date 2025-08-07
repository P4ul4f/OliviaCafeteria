const express = require('express');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting debug server...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔧 Port:', process.env.PORT);
console.log('🔥 URGENT: Debug server for Railway deployment');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads-files');
if (!fs.existsSync(uploadsDir)) {
    console.log('📁 Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created');
}

// Función segura para ejecutar DatabaseInitializer
async function runDatabaseInitializer() {
    try {
        console.log('🔄 Starting DatabaseInitializer...');
        
        // Debug: Mostrar todas las variables de entorno disponibles
        console.log('🔍 Environment variables check:');
        console.log('DB_HOST:', process.env.DB_HOST ? 'SET' : 'NOT SET');
        console.log('DB_USER:', process.env.DB_USER ? 'SET' : 'NOT SET');
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
        console.log('DB_PORT:', process.env.DB_PORT ? 'SET' : 'NOT SET');
        console.log('DB_DATABASE:', process.env.DB_DATABASE ? 'SET' : 'NOT SET');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
        
        // Verificar si las variables de entorno están configuradas
        if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
            console.log('⚠️ Database environment variables not configured, skipping database initialization');
            console.log('🔍 Available DB variables:', {
                DB_HOST: !!process.env.DB_HOST,
                DB_USER: !!process.env.DB_USER,
                DB_PASSWORD: !!process.env.DB_PASSWORD,
                DB_PORT: !!process.env.DB_PORT,
                DB_DATABASE: !!process.env.DB_DATABASE
            });
            return;
        }

        // Importar y ejecutar DatabaseInitializer
        const { DatabaseInitializer } = require('./dist/database/init-database');
        const { DataSource } = require('typeorm');
        
        console.log('📦 Creating DataSource for DatabaseInitializer...');
        
        // Crear DataSource
        const dataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: false,
            logging: true,
        });
        
        console.log('🔌 Connecting to database...');
        await dataSource.initialize();
        console.log('✅ Database connection established');
        
        // Ejecutar DatabaseInitializer
        const dbInitializer = new DatabaseInitializer(dataSource);
        console.log('🏗️  Running DatabaseInitializer...');
        await dbInitializer.initialize();
        
        console.log('✅ DatabaseInitializer completed successfully');
        await dataSource.destroy();
        console.log('🔌 Database connection closed');
        
    } catch (error) {
        console.error('❌ DatabaseInitializer error:', error.message);
        console.log('⚠️ Continuing without database initialization - server will still work');
    }
}

const app = express();

// Configuración de CORS para permitir Vercel
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://olivia-cafeteria.vercel.app',
    'https://olivia-cafeteria-git-main-paulaferreyra.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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

async function startServer() {
    try {
        // Ejecutar DatabaseInitializer antes de arrancar el servidor
        await runDatabaseInitializer();
        
        app.listen(port, '0.0.0.0', () => {
            console.log(`✅ Debug server running on port ${port}`);
            console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
            console.log('🎉 Debug server started successfully!');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
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

// Iniciar servidor
startServer(); 