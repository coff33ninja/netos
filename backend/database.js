import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { serverConfig } from './config/server.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

async function initializeDatabase() {
    if (db) return db;

    db = await open({
        filename: join(__dirname, '..', serverConfig.dbPath),
        driver: sqlite3.Database
    });

    // Create users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create devices table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ip TEXT NOT NULL,
            mac TEXT,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            lastSeen TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create scans table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deviceId INTEGER,
            result TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (deviceId) REFERENCES devices (id)
        )
    `);

    // Create indexes
    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        CREATE INDEX IF NOT EXISTS idx_devices_ip ON devices(ip);
        CREATE INDEX IF NOT EXISTS idx_devices_mac ON devices(mac);
        CREATE INDEX IF NOT EXISTS idx_scans_deviceId ON scans(deviceId);
    `);

    return db;
}

// Database operations
export const dbOperations = {
    // User operations
    async createUser(username, password) {
        return await db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
    },

    async getUserById(id) {
        return await db.get('SELECT * FROM users WHERE id = ?', [id]);
    },

    async getUserByUsername(username) {
        return await db.get('SELECT * FROM users WHERE username = ?', [username]);
    },

    async updateUser(name, email, id) {
        return await db.run(
            'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, email, id]
        );
    },

    // Device operations
    async insertDevice(name, ip, mac, type, status, lastSeen) {
        return await db.run(
            'INSERT INTO devices (name, ip, mac, type, status, lastSeen) VALUES (?, ?, ?, ?, ?, ?)',
            [name, ip, mac, type, status, lastSeen]
        );
    },

    async updateDevice(name, type, id) {
        return await db.run(
            'UPDATE devices SET name = ?, type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, type, id]
        );
    },

    async getDeviceById(id) {
        return await db.get('SELECT * FROM devices WHERE id = ?', [id]);
    },

    async getDeviceByIp(ip) {
        return await db.get('SELECT * FROM devices WHERE ip = ?', [ip]);
    },

    async getDeviceByMac(mac) {
        return await db.get('SELECT * FROM devices WHERE mac = ?', [mac]);
    },

    async getAllDevices() {
        return await db.all('SELECT * FROM devices ORDER BY lastSeen DESC');
    },

    // Scan operations
    async insertScan(deviceId, result, timestamp) {
        return await db.run(
            'INSERT INTO scans (deviceId, result, timestamp) VALUES (?, ?, ?)',
            [deviceId, result, timestamp]
        );
    },

    async getScanById(id) {
        return await db.get('SELECT * FROM scans WHERE id = ?', [id]);
    },

    async getLatestScans(limit) {
        return await db.all(`
            SELECT s.*, d.name as deviceName, d.ip as deviceIp
            FROM scans s
            LEFT JOIN devices d ON s.deviceId = d.id
            ORDER BY s.timestamp DESC
            LIMIT ?
        `, [limit]);
    }
};

export { initializeDatabase };
export default db;