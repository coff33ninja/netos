import { initializeDatabase } from '../database/db.js';

export class DeviceTracker {
    constructor() {
        this.db = null;
    }

    async initialize() {
        this.db = await initializeDatabase();
    }

    async trackDeviceChanges(newDevices) {
        if (!this.db) await this.initialize();

        const changes = {
            new: [],
            disappeared: [],
            changed: []
        };

        // Get previous scan results
        const previousScan = await this.db.getLatestCompletedScan();
        const previousDevices = previousScan?.devices_found || [];

        // Track new and changed devices
        for (const newDevice of newDevices) {
            const previousDevice = previousDevices.find(d => d.ip === newDevice.ip);
            
            if (!previousDevice) {
                changes.new.push(newDevice);
            } else if (this.hasDeviceChanged(previousDevice, newDevice)) {
                changes.changed.push({
                    previous: previousDevice,
                    current: newDevice,
                    changes: this.getDeviceChanges(previousDevice, newDevice)
                });
            }
        }

        // Track disappeared devices
        changes.disappeared = previousDevices.filter(
            prev => !newDevices.some(curr => curr.ip === prev.ip)
        );

        return changes;
    }

    hasDeviceChanged(prev, curr) {
        return (
            prev.mac !== curr.mac ||
            prev.name !== curr.name ||
            prev.type !== curr.type ||
            prev.status !== curr.status
        );
    }

    getDeviceChanges(prev, curr) {
        const changes = [];
        
        if (prev.mac !== curr.mac) {
            changes.push({ field: 'mac', from: prev.mac, to: curr.mac });
        }
        if (prev.name !== curr.name) {
            changes.push({ field: 'name', from: prev.name, to: curr.name });
        }
        if (prev.type !== curr.type) {
            changes.push({ field: 'type', from: prev.type, to: curr.type });
        }
        if (prev.status !== curr.status) {
            changes.push({ field: 'status', from: prev.status, to: curr.status });
        }

        return changes;
    }

    async getDeviceHistory(ip, limit = 10) {
        if (!this.db) await this.initialize();

        const scans = await this.db.getLatestScans(100); // Get more scans to filter
        const history = [];

        for (const scan of scans) {
            const device = scan.devices_found?.find(d => d.ip === ip);
            if (device) {
                history.push({
                    timestamp: scan.timestamp,
                    ...device
                });
            }
        }

        return history.slice(0, limit);
    }
}