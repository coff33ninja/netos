import { exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';

const execAsync = promisify(exec);

export async function scanNetwork(startIp, endIp, scanId, db) {
    try {
        // Generate IP range
        const ips = generateIpRange(startIp, endIp);
        const results = [];

        // Update scan status to in_progress
        await db.updateNetworkScan(scanId, {
            status: 'pending',
            devices_found: [],
            started_at: new Date().toISOString()
        });

        console.log(`Starting network scan from ${startIp} to ${endIp}`);

        // Scan each IP
        for (const ip of ips) {
            try {
                console.log(`Scanning IP: ${ip}`);
                const isAlive = await pingHost(ip);
                
                if (isAlive) {
                    console.log(`Device found at ${ip}`);
                    const macAddress = await getMacAddress(ip);
                    const deviceType = await detectDeviceType(ip);
                    
                    console.log(`Device details - MAC: ${macAddress}, Type: ${deviceType}`);
                    
                    // Add or update device in database
                    const existingDevice = db.findDeviceByIp(ip);
                    if (existingDevice) {
                        db.updateDevice(existingDevice.id, {
                            mac: macAddress,
                            type: deviceType,
                            status: 'online',
                            last_seen: new Date().toISOString()
                        });
                    } else {
                        db.createDevice({
                            name: `Device (${ip})`,
                            ip: ip,
                            mac: macAddress,
                            type: deviceType,
                            status: 'online',
                            last_seen: new Date().toISOString()
                        });
                    }
                    results.push({ ip, mac: macAddress, type: deviceType });
                }
            } catch (error) {
                console.error(`Error scanning ${ip}:`, error);
            }
        }

        console.log(`Scan completed. Found ${results.length} devices`);

        // Update scan results
        await db.updateNetworkScan(scanId, {
            status: 'completed',
            devices_found: results,
            completed_at: new Date().toISOString()
        });

        return scanId;
    } catch (error) {
        console.error('Network scan failed:', error);
        await db.updateNetworkScan(scanId, {
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
        const { stdout } = await execAsync(pingCommand);
        // Check for actual success in the output
        if (isWindows) {
            return stdout.includes('bytes=') && !stdout.includes('Request timed out');
        } else {
            return stdout.includes(' 0% packet loss');
        }
    } catch (error) {
        console.log(`Ping failed for ${ip}:`, error.message);
        return false;
    }
}

async function getMacAddress(ip) {
    const isWindows = platform() === 'win32';
    try {
        if (isWindows) {
            // First ping to ensure ARP cache is populated
            await execAsync(`ping -n 1 -w 1000 ${ip}`);
            
            const { stdout } = await execAsync(`arp -a ${ip}`);
            const lines = stdout.split('\n');
            for (const line of lines) {
                if (line.includes(ip)) {
                    const match = line.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/);
                    if (match) {
                        return match[0].toUpperCase();
                    }
                }
            }
            return null;
        } else {
            const { stdout } = await execAsync(`arp -n ${ip}`);
            const match = stdout.match(/([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}/);
            return match ? match[0].toUpperCase() : null;
        }
    } catch (error) {
        console.error(`Failed to get MAC address for ${ip}:`, error);
        return null;
    }
}

async function detectDeviceType(ip) {
    const isWindows = platform() === 'win32';
    if (isWindows) {
        try {
            const { stdout } = await execAsync(`ping -n 1 -w 1000 ${ip}`);
            if (stdout.includes('TTL=128')) return 'Windows Host';
            if (stdout.includes('TTL=64')) return 'Linux/Unix Host';
            if (stdout.includes('TTL=255')) return 'Network Device';
            return 'Unknown Device';
        } catch {
            return 'Unknown Device';
        }
    }

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

        return 'Unknown Device';
    } catch {
        return 'Unknown Device';
    }
}