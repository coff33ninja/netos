export const serverConfig = {
    port: process.env.PORT || 3001,  // Using 3001 as shown in vite.config.ts proxy settings
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    environment: process.env.NODE_ENV || 'development',
    dbPath: './database.db'
};

export const dbConfig = {
    path: './database.db',
    migrations: './src/database/migrations',
    seeders: './src/database/seeders'
};