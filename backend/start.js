const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Olivia Backend with NestJS...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔧 Port:', process.env.PORT);

// Ejecutar el build primero
console.log('🔨 Building application...');
const buildProcess = spawn('npm', ['run', 'build'], { 
  stdio: 'inherit',
  shell: true 
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed with code:', code);
    process.exit(code);
  }
  
  console.log('✅ Build completed successfully');
  
  // Ejecutar la aplicación NestJS
  console.log('🎯 Starting NestJS application...');
  const appProcess = spawn('node', ['dist/main.js'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  appProcess.on('close', (code) => {
    console.log('🔄 Application process exited with code:', code);
    process.exit(code);
  });
  
  appProcess.on('error', (error) => {
    console.error('❌ Application process error:', error);
    process.exit(1);
  });
});

buildProcess.on('error', (error) => {
  console.error('❌ Build process error:', error);
  process.exit(1);
});
