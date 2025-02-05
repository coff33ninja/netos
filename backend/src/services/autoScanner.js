import { scanNetwork } from './networkScanner.js';
import { initializeDatabase } from '../database/db.js';
import { DeviceTracker } from './deviceTracking.js';

export class AutoScanner {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.db = null;
        this.deviceTracker = new DeviceTracker();
        this.config = {
            enabled: false,
            intervalMinutes: 30,
            startIp: '',
            endIp: '',
            notifyOnChanges: true
        };
    }

    async initialize() {
        this.db = await initializeDatabase();
        await this.deviceTracker.initialize();
        await this.loadConfig();
        
        if (this.config.enabled) {
            await this.start();
        }
    }

    async loadConfig() {
        try {
            const config = await this.db.getAutoScanConfig();
            if (config) {
                this.config = { ...this.config, ...config };
            }
        } catch (error) {
            console.error('Failed to load auto-scan config:', error);
        }
    }

    async saveConfig() {
        try {
            await this.db.saveAutoScanConfig(this.config);
        } catch (error) {
            console.error('Failed to save auto-scan config:', error);
        }
    }

    async start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.config.enabled = true;
        await this.saveConfig();

        // Perform initial scan
        await this.performScan();

        // Set up periodic scanning
        this.interval = setInterval(
            () => this.performScan(),
            this.config.intervalMinutes * 60 * 1000
        );
    }

    async stop() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.config.enabled = false;
        await this.saveConfig();

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async performScan() {
        try {
            console.log('Starting automatic network scan...');
            const scanId = await scanNetwork(
                this.config.startIp,
                this.config.endIp,
                this.db
            );

            if (this.config.notifyOnChanges) {
                const scan = await this.db.findNetworkScanById(scanId);
                if (scan.status === 'completed') {
                    const changes = await this.deviceTracker.trackDeviceChanges(
                        scan.devices_found
                    );

                    if (this.hasSignificantChanges(changes)) {
                        await this.notifyChanges(changes);
                    }
                }
            }
        } catch (error) {
            console.error('Automatic scan failed:', error);
        }
    }

    hasSignificantChanges(changes) {
        return (
            changes.new.length > 0 ||
            changes.disappeared.length > 0 ||
            changes.changed.length > 0
        );
    }

    async notifyChanges(changes) {
        // TODO: Implement notification system (e.g., WebSocket, push notifications)
        console.log('Network changes detected:', changes);
    }

    async updateConfig(newConfig) {
        const wasEnabled = this.config.enabled;
        const intervalChanged = 
            newConfig.intervalMinutes !== this.config.intervalMinutes;

        this.config = { ...this.config, ...newConfig };
        await this.saveConfig();

        if (intervalChanged && this.isRunning) {
            await this.stop();
            await this.start();
        } else if (!wasEnabled && this.config.enabled) {
            await this.start();
        } else if (wasEnabled && !this.config.enabled) {
            await this.stop();
        }
    }
}

// Create singleton instance
export const autoScanner = new AutoScanner();