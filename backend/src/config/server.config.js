export const serverConfig = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    environment: process.env.NODE_ENV || 'development'
};