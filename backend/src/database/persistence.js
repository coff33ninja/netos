import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', '..', 'data');
const DATA_FILE = join(DATA_DIR, 'db.json');

export async function saveData(data) {
    try {
        // Ensure data directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Save data to file
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

export async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist yet, return empty data
            return {
                users: new Map(),
                devices: new Map(),
                networkScans: new Map(),
                userIdCounter: 1,
                deviceIdCounter: 1,
                networkScanIdCounter: 1
            };
        }
        console.error('Error loading data:', error);
        throw error;
    }
}