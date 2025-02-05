import { initializeDatabase } from '../../src/database/db.js';

describe('User Model', () => {
    let db;
    const testUser = {
        username: 'testuser',
        password: 'password123',
        name: 'Test User',
        email: 'test@example.com'
    };

    beforeAll(() => {
        db = initializeDatabase();
    });

    beforeEach(() => {
        db.clear();
    });

    test('should create a new user', () => {
        const userId = db.createUser(testUser);
        expect(userId).toBeDefined();

        const user = db.findUserById(userId);
        expect(user).toBeDefined();
        expect(user.username).toBe(testUser.username);
        expect(user.name).toBe(testUser.name);
        expect(user.email).toBe(testUser.email);
    });

    test('should find user by username', () => {
        db.createUser(testUser);
        const user = db.findUserByUsername(testUser.username);
        expect(user).toBeDefined();
        expect(user.username).toBe(testUser.username);
    });

    test('should update user', () => {
        const userId = db.createUser(testUser);
        const updates = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };

        const success = db.updateUser(userId, updates);
        expect(success).toBe(true);

        const user = db.findUserById(userId);
        expect(user.name).toBe(updates.name);
        expect(user.email).toBe(updates.email);
    });
});