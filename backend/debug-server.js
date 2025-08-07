const { spawn } = require('child_process');

// Iniciar la aplicación NestJS
const nestProcess = spawn('npx', ['ts-node', 'src/main.ts'], {
  stdio: 'inherit',
  env: { ...process.env }
});

nestProcess.on('close', (code) => {
  process.exit(code);
}); 