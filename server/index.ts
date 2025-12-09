import dotenv from 'dotenv';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { corsMiddleware, errorHandler, loggingMiddleware } from './src/middleware';
import routes from './src/routes';

dotenv.config();

const app = new Hono();
const port = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use('*', loggingMiddleware);
app.use('*', corsMiddleware);
app.use('*', errorHandler);

// Routes
app.route('/', routes);

// Start server
serve({
    fetch: app.fetch,
    port,
});

console.log(`🚀 Server running on http://localhost:${port}`);
