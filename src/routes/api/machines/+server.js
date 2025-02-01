import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit'
import path from 'path';

const dbPath = process.env.NODE_ENV === 'production'
    ? '/app/data/database.db' // Docker production path
    : path.join(process.cwd(), 'data', 'database.db'); // Local development path
// Open a SQLite database (it creates `database.db` if it doesn’t exist)
const db = new Database(dbPath);

// Initialize the database (ensures the tables exist)
db.exec(`
    CREATE TABLE IF NOT EXISTS machines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        current_usage INTEGER DEFAULT 0,
        lifetime_usage INTEGER,
        maintenance_interval INTEGER,
        category TEXT,
        unit_type TEXT,
        maintenance_resource_url TEXT
    );

    CREATE TABLE IF NOT EXISTS usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine_id INTEGER,
        user_name TEXT,
        usage_time INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machine_id) REFERENCES machines(id)
    );
`);

// get list of all machines
export async function GET(event) {
    console.log(event)
    const machines = db.prepare('SELECT * FROM machines').all();
    return json(machines)
}

// add a machine
export async function POST({ request }) {
    const { name, description, current_usage, lifetime_usage, maintenance_interval, category, unit_type, maintenance_resource_url } = await request.json();

    try {
        const stmt = db.prepare(`
            INSERT INTO machines (name, description, current_usage, lifetime_usage, maintenance_interval, category, unit_type, maintenance_resource_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(name, description, current_usage || 0, lifetime_usage, maintenance_interval, category, unit_type, maintenance_resource_url || null);
        return json({ success: true, id: result.lastInsertRowid })
    } catch (error) {
        return json({ success: false, error: error.message }, { status: 500 });
    }
}
