import { serve } from '@hono/node-server';
import app from './server.js';
import { log } from './logger.js';

const port = parseInt(process.env.PORT || '3001');

serve({
  fetch: app.fetch,
  port,
});

log.banner(port);
