import { serve } from '@hono/node-server';
import app from './server.js';

const port = parseInt(process.env.PORT || '3001');

console.log(`Starting backend server on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Backend server running at http://localhost:${port}`);
console.log(`Health check: http://localhost:${port}/health`);
