import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the server
const server = spawn('node', ['test.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
});

process.on('SIGINT', () => {
    server.kill();
    process.exit();
});