import { initializeDatabase } from '../../src/database/db.js';

describe('Device Model', () => {
    let db;
    const testDevice = {
        name: 'Test Device',
        ip: '192.168.1.100',
        mac: '00:11:22:33:44:55',
        type: 'Router',
        status: 'Online'
    };

    beforeAll(() => {
        db = initializeDatabase();
    });

    beforeEach(() => {
        db.clear();
    });

    test('should create a new device', () => {
        const deviceId = db.createDevice(testDevice);
        expect(deviceId).toBeDefined();

        const device = db.findDeviceById(deviceId);
        expect(device).toBeDefined();
        expect(device.name).toBe(testDevice.name);
        expect(device.ip).toBe(testDevice.ip);
        expect(device.mac).toBe(testDevice.mac);
    });

    test('should find device by MAC', () => {
        db.createDevice(testDevice);
        const device = db.findDeviceByMac(testDevice.mac);
        expect(device).toBeDefined();
        expect(device.mac).toBe(testDevice.mac);
    });

    test('should find device by IP', () => {
        db.createDevice(testDevice);
        const device = db.findDeviceByIp(testDevice.ip);
        expect(device).toBeDefined();
        expect(device.ip).toBe(testDevice.ip);
    });

    test('should update device', () => {
        const deviceId = db.createDevice(testDevice);
        const updates = {
            name: 'Updated Device',
            type: 'Switch',
            status: 'Offline'
        };

        const success = db.updateDevice(deviceId, updates);
        expect(success).toBe(true);

        const device = db.findDeviceById(deviceId);
        expect(device.name).toBe(updates.name);
        expect(device.type).toBe(updates.type);
        expect(device.status).toBe(updates.status);
    });

    test('should get all devices', () => {
        db.createDevice(testDevice);
        db.createDevice({
            ...testDevice,
            name: 'Another Device',
            ip: '192.168.1.101',
            mac: '00:11:22:33:44:66'
        });

        const devices = db.getAllDevices();
        expect(devices).toHaveLength(2);
    });
});