// Simple in-memory database for testing
class InMemoryDB {
    constructor() {
        this.users = new Map();
        this.devices = new Map();
        this.networkScans = new Map();
        this.userIdCounter = 1;
        this.deviceIdCounter = 1;
        this.networkScanIdCounter = 1;
    }

    // User methods
    createUser(user) {
        const id = this.userIdCounter++;
        this.users.set(id, { ...user, id });
        return id;
    }

    findUserById(id) {
        return this.users.get(id);
    }

    findUserByUsername(username) {
        return Array.from(this.users.values())
            .find(user => user.username === username);
    }

    updateUser(id, updates) {
        const user = this.users.get(id);
        if (user) {
            this.users.set(id, { ...user, ...updates });
            return true;
        }
        return false;
    }

    // Device methods
    createDevice(device) {
        const id = this.deviceIdCounter++;
        this.devices.set(id, { 
            ...device, 
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        return id;
    }

    findDeviceById(id) {
        return this.devices.get(id);
    }

    findDeviceByMac(mac) {
        return Array.from(this.devices.values())
            .find(device => device.mac === mac);
    }

    findDeviceByIp(ip) {
        return Array.from(this.devices.values())
            .find(device => device.ip === ip);
    }

    updateDevice(id, updates) {
        const device = this.devices.get(id);
        if (device) {
            this.devices.set(id, { 
                ...device, 
                ...updates,
                updated_at: new Date().toISOString()
            });
            return true;
        }
        return false;
    }

    getAllDevices() {
        return Array.from(this.devices.values())
            .sort((a, b) => b.last_seen?.localeCompare(a.last_seen));
    }

    // Network scan methods
    createNetworkScan(scan) {
        const id = this.networkScanIdCounter++;
        this.networkScans.set(id, { 
            ...scan, 
            id,
            started_at: new Date().toISOString()
        });
        return id;
    }

    findNetworkScanById(id) {
        return this.networkScans.get(id);
    }

    updateNetworkScan(id, updates) {
        const scan = this.networkScans.get(id);
        if (scan) {
            this.networkScans.set(id, { ...scan, ...updates });
            return true;
        }
        return false;
    }

    getLatestNetworkScans(limit = 10) {
        return Array.from(this.networkScans.values())
            .sort((a, b) => b.started_at.localeCompare(a.started_at))
            .slice(0, limit);
    }

    // Database management
    clear() {
        this.users.clear();
        this.devices.clear();
        this.networkScans.clear();
        this.userIdCounter = 1;
        this.deviceIdCounter = 1;
        this.networkScanIdCounter = 1;
    }
}

let db = null;

export function initializeDatabase() {
    if (!db) {
        db = new InMemoryDB();
    }
    return db;
}

export function closeDatabase() {
    if (db) {
        db.clear();
        db = null;
    }
}

export default db;