import { saveData, loadData } from './persistence.js';

class InMemoryDB {
    constructor() {
        this.users = new Map();
        this.devices = new Map();
        this.networkScans = new Map();
        this.userIdCounter = 1;
        this.deviceIdCounter = 1;
        this.networkScanIdCounter = 1;
    }

    async initialize() {
        const data = await loadData();
        this.users = new Map(Object.entries(data.users || {}));
        this.devices = new Map(Object.entries(data.devices || {}));
        this.networkScans = new Map(Object.entries(data.networkScans || {}));
        this.userIdCounter = data.userIdCounter || 1;
        this.deviceIdCounter = data.deviceIdCounter || 1;
        this.networkScanIdCounter = data.networkScanIdCounter || 1;
    }

    async save() {
        const data = {
            users: Object.fromEntries(this.users),
            devices: Object.fromEntries(this.devices),
            networkScans: Object.fromEntries(this.networkScans),
            userIdCounter: this.userIdCounter,
            deviceIdCounter: this.deviceIdCounter,
            networkScanIdCounter: this.networkScanIdCounter
        };
        await saveData(data);
    }

    // User methods
    createUser(user) {
        const id = this.userIdCounter++;
        this.users.set(id, { ...user, id });
        this.save();
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
            this.save();
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
        this.save();
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
            this.save();
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
        this.save();
        return id;
    }

    findNetworkScanById(id) {
        return this.networkScans.get(id);
    }

    updateNetworkScan(id, updates) {
        const scan = this.networkScans.get(id);
        if (scan) {
            this.networkScans.set(id, { ...scan, ...updates });
            this.save();
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
        this.save();
    }
}

let db = null;

export async function initializeDatabase() {
    if (!db) {
        db = new InMemoryDB();
        await db.initialize();
    }
    return db;
}

export async function closeDatabase() {
    if (db) {
        await db.save();
        db = null;
    }
}