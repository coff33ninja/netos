import { initializeDatabase } from '../database/db.js';

export class NetworkScan {
    static async create({ startIp, endIp }) {
        const db = await initializeDatabase();
        const result = await db.run(
            `INSERT INTO network_scans (start_ip, end_ip, status, devices_found)
             VALUES (?, ?, 'started', 0)`,
            [startIp, endIp]
        );
        return result.lastID;
    }

    static async updateStatus(id, { status, devicesFound, error = null }) {
        const db = await initializeDatabase();
        await db.run(
            `UPDATE network_scans 
             SET status = ?, 
                 devices_found = ?,
                 error = ?,
                 completed_at = CASE 
                    WHEN ? IN ('completed', 'failed') THEN CURRENT_TIMESTAMP
                    ELSE NULL
                 END
             WHERE id = ?`,
            [status, devicesFound, error, status, id]
        );
    }

    static async getLatest(limit = 10) {
        const db = await initializeDatabase();
        return await db.all(
            'SELECT * FROM network_scans ORDER BY started_at DESC LIMIT ?',
            [limit]
        );
    }

    static async findById(id) {
        const db = await initializeDatabase();
        return await db.get('SELECT * FROM network_scans WHERE id = ?', [id]);
    }
}