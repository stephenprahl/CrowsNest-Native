// Configuration
export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL,
    },
};

export const isDevelopment = config.env === 'development';
export const isProduction = config.env === 'production';
