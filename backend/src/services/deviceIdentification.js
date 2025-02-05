import dns from 'dns/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

// MAC address manufacturer database URL
const MAC_API_URL = 'https://api.macvendors.com/';

export async function resolveDeviceName(ip) {
    try {
        // Try reverse DNS lookup
        const hostnames = await dns.reverse(ip);
        if (hostnames && hostnames.length > 0) {
            return hostnames[0];
        }

        // Try NetBIOS name (Windows)
        try {
            const { stdout } = await execAsync(`nmblookup -A ${ip}`);
            const match = stdout.match(/<00>\s+[A-Z]+\s+([A-Za-z0-9-]+)/);
            if (match) {
                return match[1];
            }
        } catch (error) {
            console.log(`NetBIOS lookup failed for ${ip}:`, error.message);
        }

        // Try mDNS (Multicast DNS)
        try {
            const { stdout } = await execAsync(`avahi-resolve-address ${ip}`);
            if (stdout.trim()) {
                return stdout.split('\t')[1].trim();
            }
        } catch (error) {
            console.log(`mDNS lookup failed for ${ip}:`, error.message);
        }

        return null;
    } catch (error) {
        console.error(`Name resolution failed for ${ip}:`, error);
        return null;
    }
}

export async function lookupManufacturer(mac) {
    if (!mac) return null;
    
    try {
        // Clean up MAC address format
        const cleanMac = mac.replace(/[:-]/g, '').substring(0, 6).toUpperCase();
        
        // Check local cache first
        const cached = await checkManufacturerCache(cleanMac);
        if (cached) return cached;

        // Make API request
        const response = await fetch(`${MAC_API_URL}${cleanMac}`);
        if (!response.ok) {
            throw new Error(`MAC lookup failed: ${response.statusText}`);
        }

        const manufacturer = await response.text();
        
        // Cache the result
        await cacheManufacturer(cleanMac, manufacturer);
        
        return manufacturer;
    } catch (error) {
        console.error(`Manufacturer lookup failed for ${mac}:`, error);
        return null;
    }
}

// Simple port scanner
export async function scanPorts(ip) {
    const commonPorts = {
        21: 'FTP',
        22: 'SSH',
        23: 'Telnet',
        25: 'SMTP',
        53: 'DNS',
        80: 'HTTP',
        443: 'HTTPS',
        445: 'SMB',
        3389: 'RDP',
        8080: 'HTTP-Proxy'
    };

    const openPorts = [];

    for (const [port, service] of Object.entries(commonPorts)) {
        try {
            const { stdout } = await execAsync(`nc -zv -w1 ${ip} ${port} 2>&1`);
            openPorts.push({ port: parseInt(port), service });
        } catch (error) {
            // Port is closed or filtered
            continue;
        }
    }

    return openPorts;
}

// Cache functions for manufacturer lookups
async function checkManufacturerCache(macPrefix) {
    // TODO: Implement caching using the database
    return null;
}

async function cacheManufacturer(macPrefix, manufacturer) {
    // TODO: Implement caching using the database
}