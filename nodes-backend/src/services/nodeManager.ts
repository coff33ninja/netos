import { SystemInfo } from '../types';
import * as si from 'systeminformation';

export class NodeManager {
    private nodeInfo: SystemInfo;

    constructor() {
        this.nodeInfo = {
            id: this.generateNodeId(),
            name: '',
            status: 'offline',
            type: 'Secondary',
            lastSeen: new Date().toISOString(),
            metrics: {
                cpu: 0,
                memory: 0,
                disk: 0,
                network: 0
            }
        };
        this.initialize();
    }

    private generateNodeId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    private async initialize() {
        try {
            const [system, os] = await Promise.all([
                si.system(),
                si.osInfo()
            ]);
            
            this.nodeInfo.name = `${system.manufacturer} ${system.model}`;
            this.nodeInfo.status = 'online';
            this.startMetricsCollection();
        } catch (error) {
            console.error('Failed to initialize node:', error);
        }
    }

    private async startMetricsCollection() {
        setInterval(async () => {
            try {
                const [cpu, mem, disk, networkStats] = await Promise.all([
                    si.currentLoad(),
                    si.mem(),
                    si.fsSize(),
                    si.networkStats()
                ]);

                this.nodeInfo.metrics = {
                    cpu: Math.round(cpu.currentLoad),
                    memory: Math.round((mem.used / mem.total) * 100),
                    disk: Math.round((disk[0].used / disk[0].size) * 100),
                    network: Math.round(networkStats[0].tx_sec / 1024 / 1024) // MB/s
                };
                this.nodeInfo.lastSeen = new Date().toISOString();
            } catch (error) {
                console.error('Failed to update metrics:', error);
            }
        }, 5000); // Update every 5 seconds
    }

    public getNodeInfo(): SystemInfo {
        return this.nodeInfo;
    }

    public async getDevices() {
        try {
            const networkInterfaces = await si.networkInterfaces();
            return networkInterfaces.map(iface => ({
                id: iface.iface,
                name: iface.iface,
                ip: iface.ip4,
                mac: iface.mac,
                type: 'Network Interface',
                status: iface.operstate === 'up' ? 'Online' : 'Offline'
            }));
        } catch (error) {
            console.error('Failed to get devices:', error);
            return [];
        }
    }

    public async performAction(action: 'restart' | 'shutdown') {
        // Implement system actions based on OS
        console.log(`Performing action: ${action}`);
        // This should be implemented based on the OS and permissions
    }
}