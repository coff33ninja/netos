import { initializeDatabase, closeDatabase } from '../src/database/db.js';

// Setup and teardown for all tests
beforeAll(async () => {
    // Initialize test database
    const db = initializeDatabase();
    // Clear all tables
    db.clear();
});

afterAll(async () => {
    closeDatabase();
});