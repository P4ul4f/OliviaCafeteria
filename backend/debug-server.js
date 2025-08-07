const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Olivia Backend with NestJS...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔧 Port:', process.env.PORT);
console.log('🔥 URGENT: Debug server for Railway deployment - NOW RUNNING NESTJS');

// Ejecutar la aplicación NestJS
console.log('🎯 Starting NestJS application...');
const appProcess = spawn('npx', ['ts-node', 'src/main.ts'], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
});

appProcess.on('close', (code) => {
  console.log('🔄 Application process exited with code:', code);
  process.exit(code);
});

appProcess.on('error', (error) => {
  console.error('❌ Application process error:', error);
  process.exit(1);
}); 