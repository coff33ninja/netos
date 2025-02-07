import * as si from 'systeminformation';
import { DeviceInfo } from '../types';

export class NetworkScanner {
    public async scanNetwork(): Promise<DeviceInfo[]> {
        try {
            const [networkInterfaces, networkConnections] = await Promise.all([
                si.networkInterfaces(),
                si.networkConnections()
            ]);

            const devices: DeviceInfo[] = [];

            // Add local network interfaces
            networkInterfaces.forEach(iface => {
                if (iface.ip4) {
                    devices.push({
                        id: devices.length + 1,
                        name: iface.iface,
                        ip: iface.ip4,
                        mac: iface.mac,
                        type: 'Network Interface',
                        status: iface.operstate === 'up' ? 'Online' : 'Offline',
                        lastSeen: new Date().toISOString()
                    });
                }
            });

            // Add active connections
            networkConnections.forEach(conn => {
                if (conn.peerAddress && conn.peerAddress !== '0.0.0.0') {
                    devices.push({
                        id: devices.length + 1,
                        name: `Connection ${conn.peerAddress}`,
                        ip: conn.peerAddress,
                        type: 'Remote Connection',
                        status: 'Online',
                        lastSeen: new Date().toISOString()
                    });
                }
            });

            return devices;
        } catch (error) {
            console.error('Network scan failed:', error);
            return [];
        }
    }
}