import bcrypt from 'bcrypt';
import { initializeDatabase } from '../database/db.js';

export class User {
    static async findByUsername(username) {
        const db = await initializeDatabase();
        return await db.get('SELECT * FROM users WHERE username = ?', [username]);
    }

    static async findById(id) {
        const db = await initializeDatabase();
        return await db.get('SELECT * FROM users WHERE id = ?', [id]);
    }

    static async create({ username, password, name, email }) {
        const db = await initializeDatabase();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.run(
            `INSERT INTO users (username, password, name, email)
             VALUES (?, ?, ?, ?)`,
            [username, hashedPassword, name, email]
        );

        return result.lastID;
    }

    static async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }

    static async update(id, { name, email }) {
        const db = await initializeDatabase();
        await db.run(
            `UPDATE users 
             SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [name, email, id]
        );
    }
}