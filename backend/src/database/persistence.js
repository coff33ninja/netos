import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../data/db.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.dirname(DATA_FILE);
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Load data from file
export async function loadData() {
    try {
        await ensureDataDirectory();
        
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // If file doesn't exist, return empty data structure
                return {
                    users: {},
                    devices: {},
                    networkScans: {},
                    deviceHistory: {},
                    manufacturerCache: {},
                    config: {
                        autoScan: {
                            enabled: false,
                            intervalMinutes: 30,
                            startIp: '',
                            endIp: '',
                            notifyOnChanges: true
                        }
                    },
                    userIdCounter: 1,
                    deviceIdCounter: 1,
                    networkScanIdCounter: 1
                };
            }
            throw error;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Save data to file
export async function saveData(data) {
    try {
        await ensureDataDirectory();

        // Convert Maps to plain objects for JSON serialization
        const serializedData = {
            users: Object.fromEntries(data.users instanceof Map ? data.users : Object.entries(data.users)),
            devices: Object.fromEntries(data.devices instanceof Map ? data.devices : Object.entries(data.devices)),
            networkScans: Object.fromEntries(data.networkScans instanceof Map ? data.networkScans : Object.entries(data.networkScans)),
            deviceHistory: Object.fromEntries(data.deviceHistory instanceof Map ? data.deviceHistory : Object.entries(data.deviceHistory)),
            manufacturerCache: Object.fromEntries(data.manufacturerCache instanceof Map ? data.manufacturerCache : Object.entries(data.manufacturerCache)),
            config: data.config,
            userIdCounter: data.userIdCounter,
            deviceIdCounter: data.deviceIdCounter,
            networkScanIdCounter: data.networkScanIdCounter
        };

        await fs.writeFile(
            DATA_FILE,
            JSON.stringify(serializedData, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}