import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';
import { initializeDatabase } from '../database/db.js';

const execAsync = promisify(exec);
const db = initializeDatabase();

export async function scanNetwork(startIp, endIp) {
    const scanId = db.createNetworkScan({
        start_ip: startIp,
        end_ip: endIp,
        status: 'in_progress',
        devices_found: 0
    });

    try {
        // Generate IP range
        const ips = generateIpRange(startIp, endIp);
        const results = [];

        // Scan each IP
        for (const ip of ips) {
            try {
                const isAlive = await pingHost(ip);
                if (isAlive) {
                    const macAddress = await getMacAddress(ip);
                    const deviceType = await detectDeviceType(ip);
                    
                    // Add or update device in database
                    const existingDevice = db.findDeviceByIp(ip);
                    if (existingDevice) {
                        db.updateDevice(existingDevice.id, {
                            mac: macAddress,
                            type: deviceType,
                            status: 'Online',
                            last_seen: new Date().toISOString()
                        });
                    } else {
                        db.createDevice({
                            name: `Device (${ip})`,
                            ip: ip,
                            mac: macAddress,
                            type: deviceType,
                            status: 'Online'
                        });
                    }
                    results.push(ip);
                }
            } catch (error) {
                console.error(`Error scanning ${ip}:`, error);
            }
        }

        // Update scan results
        db.updateNetworkScan(scanId, {
            status: 'completed',
            devices_found: results.length,
            completed_at: new Date().toISOString()
        });

        return scanId;
    } catch (error) {
        db.updateNetworkScan(scanId, {
            status: 'failed',
            error: error.message,
            completed_at: new Date().toISOString()
        });
        throw error;
    }
}

function generateIpRange(startIp, endIp) {
    const start = ipToLong(startIp);
    const end = ipToLong(endIp);
    const ips = [];

    for (let i = start; i <= end; i++) {
        ips.push(longToIp(i));
    }

    return ips;
}

function ipToLong(ip) {
    return ip.split('.')
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function longToIp(long) {
    return [
        (long >>> 24) & 255,
        (long >>> 16) & 255,
        (long >>> 8) & 255,
        long & 255
    ].join('.');
}

async function pingHost(ip) {
    const isWindows = platform() === 'win32';
    const pingCommand = isWindows
        ? `ping -n 1 -w 1000 ${ip}`
        : `ping -c 1 -W 1 ${ip}`;

    try {
        await execAsync(pingCommand);
        return true;
    } catch {
        return false;
    }
}

async function getMacAddress(ip) {
    const isWindows = platform() === 'win32';
    try {
        if (isWindows) {
            const { stdout } = await execAsync(`arp -a ${ip}`);
            const match = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
            return match ? match[0].toUpperCase() : null;
        } else {
            const { stdout } = await execAsync(`arp -n ${ip}`);
            const match = stdout.match(/([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}/);
            return match ? match[0].toUpperCase() : null;
        }
    } catch {
        return null;
    }
}

async function detectDeviceType(ip) {
    try {
        // Try to detect common ports
        const ports = [
            { port: 80, type: 'Web Server' },
            { port: 443, type: 'Web Server (HTTPS)' },
            { port: 22, type: 'SSH Server' },
            { port: 53, type: 'DNS Server' },
            { port: 3389, type: 'Remote Desktop' }
        ];

        for (const { port, type } of ports) {
            try {
                await execAsync(`nc -z -w1 ${ip} ${port}`);
                return type;
            } catch {
                continue;
            }
        }

        return 'Unknown';
    } catch {
        return 'Unknown';
    }
}