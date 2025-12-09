import { Context, Next } from 'hono';

// Error handling middleware
export const errorHandler = async (c: Context, next: Next) => {
    try {
        await next();
    } catch (error) {
        console.error('Error:', error);

        if (error instanceof Error) {
            return c.json(
                {
                    success: false,
                    error: error.message,
                },
                500
            );
        }

        return c.json(
            {
                success: false,
                error: 'Internal Server Error',
            },
            500
        );
    }
};

// CORS middleware
export const corsMiddleware = async (c: Context, next: Next) => {
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');

    if (c.req.method === 'OPTIONS') {
        return c.text('');
    }

    await next();
};

// Request logging middleware
export const loggingMiddleware = async (c: Context, next: Next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    console.log(`${c.req.method} ${c.req.path} - ${duration}ms`);
};
