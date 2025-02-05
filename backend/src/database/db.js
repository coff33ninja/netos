import { loadData, saveData } from './persistence.js';

const DEFAULT_CONFIG = {
    autoScan: {
        enabled: false,
        intervalMinutes: 30,
        startIp: '',
        endIp: '',
        notifyOnChanges: true
    }
};

class Database {
    constructor() {
        this.data = {
            users: new Map(),
            devices: new Map(),
            networkScans: new Map(),
            deviceHistory: new Map(),
            manufacturerCache: new Map(),
            config: { ...DEFAULT_CONFIG },
            userIdCounter: 1,
            deviceIdCounter: 1,
            networkScanIdCounter: 1
        };
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            const data = await loadData();
            
            // Initialize with loaded data, falling back to defaults
            this.data = {
                users: new Map(Object.entries(data.users || {})),
                devices: new Map(Object.entries(data.devices || {})),
                networkScans: new Map(Object.entries(data.networkScans || {})),
                deviceHistory: new Map(Object.entries(data.deviceHistory || {})),
                manufacturerCache: new Map(Object.entries(data.manufacturerCache || {})),
                config: {
                    ...DEFAULT_CONFIG,
                    ...data.config
                },
                userIdCounter: data.userIdCounter || 1,
                deviceIdCounter: data.deviceIdCounter || 1,
                networkScanIdCounter: data.networkScanIdCounter || 1
            };

            // Ensure autoScan config exists
            if (!this.data.config.autoScan) {
                this.data.config.autoScan = { ...DEFAULT_CONFIG.autoScan };
            } else {
                // Merge with defaults to ensure all properties exist
                this.data.config.autoScan = {
                    ...DEFAULT_CONFIG.autoScan,
                    ...this.data.config.autoScan
                };
            }

            this.initialized = true;
            console.log('Database initialized with config:', this.data.config);
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    async save() {
        await saveData({
            users: Object.fromEntries(this.data.users),
            devices: Object.fromEntries(this.data.devices),
            networkScans: Object.fromEntries(this.data.networkScans),
            deviceHistory: Object.fromEntries(this.data.deviceHistory),
            manufacturerCache: Object.fromEntries(this.data.manufacturerCache),
            config: this.data.config,
            userIdCounter: this.data.userIdCounter,
            deviceIdCounter: this.data.deviceIdCounter,
            networkScanIdCounter: this.data.networkScanIdCounter
        });
    }

    // Network Scans
    createNetworkScan(scanData) {
        const id = this.data.networkScanIdCounter++;
        const scan = {
            id,
            ...scanData,
            timestamp: new Date().toISOString()
        };
        this.data.networkScans.set(id.toString(), scan);
        this.save();
        return id;
    }

    findNetworkScanById(id) {
        return this.data.networkScans.get(id.toString()) || null;
    }

    updateNetworkScan(id, updates) {
        const scan = this.findNetworkScanById(id);
        if (scan) {
            const updated = { ...scan, ...updates };
            this.data.networkScans.set(id.toString(), updated);
            this.save();
            return updated;
        }
        return null;
    }

    getLatestScans(limit = 10) {
        return Array.from(this.data.networkScans.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    getLatestCompletedScan() {
        return Array.from(this.data.networkScans.values())
            .filter(scan => scan.status === 'completed')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    }

    // Devices
    createDevice(deviceData) {
        const id = this.data.deviceIdCounter++;
        const device = {
            id: id.toString(),
            ...deviceData,
            firstSeen: new Date().toISOString(),
            lastSeen: new Date().toISOString()
        };
        this.data.devices.set(id.toString(), device);
        this.save();
        return device;
    }

    findDeviceById(id) {
        return this.data.devices.get(id.toString()) || null;
    }

    findDeviceByIp(ip) {
        return Array.from(this.data.devices.values())
            .find(device => device.ip === ip);
    }

    updateDevice(id, updates) {
        const device = this.findDeviceById(id);
        if (device) {
            const updated = { ...device, ...updates };
            this.data.devices.set(id.toString(), updated);
            this.save();
            return updated;
        }
        return null;
    }

    deleteDevice(id) {
        const deleted = this.data.devices.delete(id.toString());
        if (deleted) {
            // Also delete device history
            this.data.deviceHistory.delete(id.toString());
            this.save();
        }
        return deleted;
    }

    deleteAllDevices() {
        const count = this.data.devices.size;
        this.data.devices.clear();
        this.data.deviceHistory.clear();
        this.save();
        return count;
    }

    // Device History
    addDeviceHistory(deviceId, historyEntry) {
        let history = this.data.deviceHistory.get(deviceId) || [];
        history = [
            {
                ...historyEntry,
                timestamp: new Date().toISOString()
            },
            ...history
        ].slice(0, 100); // Keep last 100 entries
        
        this.data.deviceHistory.set(deviceId, history);
        this.save();
    }

    getDeviceHistory(deviceId, limit = 10) {
        const history = this.data.deviceHistory.get(deviceId) || [];
        return history.slice(0, limit);
    }

    // Manufacturer Cache
    getCachedManufacturer(macPrefix) {
        const cached = this.data.manufacturerCache.get(macPrefix);
        if (cached && Date.now() - cached.timestamp < 30 * 24 * 60 * 60 * 1000) { // 30 days
            return cached.manufacturer;
        }
        return null;
    }

    cacheManufacturer(macPrefix, manufacturer) {
        this.data.manufacturerCache.set(macPrefix, {
            manufacturer,
            timestamp: Date.now()
        });
        this.save();
    }

    // Configuration
    getAutoScanConfig() {
        return this.data.config.autoScan || { ...DEFAULT_CONFIG.autoScan };
    }

    saveAutoScanConfig(config) {
        this.data.config.autoScan = {
            ...DEFAULT_CONFIG.autoScan,
            ...config
        };
        this.save();
    }
}

let instance = null;

export async function initializeDatabase() {
    if (!instance) {
        instance = new Database();
        await instance.initialize();
    }
    return instance;
}