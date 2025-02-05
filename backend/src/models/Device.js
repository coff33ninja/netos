import { initializeDatabase } from '../database/db.js';

export class Device {
    static async findByMac(mac) {
        const db = await initializeDatabase();
        return await db.get('SELECT * FROM devices WHERE mac = ?', [mac]);
    }

    static async findByIp(ip) {
        const db = await initializeDatabase();
        return await db.get('SELECT * FROM devices WHERE ip = ?', [ip]);
    }

    static async findById(id) {
        const db = await initializeDatabase();
        return await db.get('SELECT * FROM devices WHERE id = ?', [id]);
    }

    static async create({ name, ip, mac, type, status }) {
        const db = await initializeDatabase();
        const result = await db.run(
            `INSERT INTO devices (name, ip, mac, type, status, last_seen)
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [name, ip, mac, type, status]
        );
        return result.lastID;
    }

    static async update(id, { name, type, status }) {
        const db = await initializeDatabase();
        await db.run(
            `UPDATE devices 
             SET name = ?, type = ?, status = ?, 
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, type, status, id]
        );
    }

    static async updateLastSeen(id) {
        const db = await initializeDatabase();
        await db.run(
            `UPDATE devices 
             SET last_seen = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [id]
        );
    }

    static async getAll() {
        const db = await initializeDatabase();
        return await db.all('SELECT * FROM devices ORDER BY last_seen DESC');
    }
}