import { initializeDatabase, closeDatabase } from '../../src/database/db.js';

describe('Database', () => {
    let db;

    beforeAll(() => {
        db = initializeDatabase();
    });

    afterAll(() => {
        closeDatabase();
    });

    test('should initialize database', () => {
        expect(db).toBeDefined();
    });

    test('should store and retrieve users', () => {
        const testUser = {
            username: 'testuser',
            password: 'password123',
            name: 'Test User',
            email: 'test@example.com'
        };

        const userId = db.createUser(testUser);
        expect(userId).toBeDefined();

        const user = db.findUserById(userId);
        expect(user).toBeDefined();
        expect(user.username).toBe(testUser.username);
    });

    test('should store and retrieve devices', () => {
        const testDevice = {
            name: 'Test Device',
            ip: '192.168.1.100',
            mac: '00:11:22:33:44:55',
            type: 'Router',
            status: 'Online'
        };

        const deviceId = db.createDevice(testDevice);
        expect(deviceId).toBeDefined();

        const device = db.findDeviceById(deviceId);
        expect(device).toBeDefined();
        expect(device.name).toBe(testDevice.name);
    });

    test('should store and retrieve network scans', () => {
        const testScan = {
            start_ip: '192.168.1.1',
            end_ip: '192.168.1.254'
        };

        const scanId = db.createNetworkScan(testScan);
        expect(scanId).toBeDefined();

        const scan = db.findNetworkScanById(scanId);
        expect(scan).toBeDefined();
        expect(scan.start_ip).toBe(testScan.start_ip);
        expect(scan.end_ip).toBe(testScan.end_ip);
    });

    test('should clear database', () => {
        // Add some data
        db.createUser({ username: 'user1', password: 'pass1' });
        db.createDevice({ name: 'device1', ip: '192.168.1.1', type: 'Router', status: 'Online' });
        db.createNetworkScan({ start_ip: '192.168.1.1', end_ip: '192.168.1.254' });

        // Clear database
        db.clear();

        // Check if data is cleared
        expect(db.getAllDevices()).toHaveLength(0);
        expect(db.findUserByUsername('user1')).toBeUndefined();
        expect(db.getLatestNetworkScans()).toHaveLength(0);
    });
});