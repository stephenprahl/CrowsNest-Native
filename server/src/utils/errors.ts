import { Context } from 'hono';

export interface HonoContext extends Context {
    userId?: string;
}

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: unknown) => {
    if (error instanceof AppError) {
        return {
            status: error.statusCode,
            body: {
                success: false,
                error: error.message,
            },
        };
    }

    if (error instanceof Error) {
        console.error('Error:', error.message);
        return {
            status: 500,
            body: {
                success: false,
                error: 'Internal Server Error',
            },
        };
    }

    return {
        status: 500,
        body: {
            success: false,
            error: 'Unknown error occurred',
        },
    };
};
