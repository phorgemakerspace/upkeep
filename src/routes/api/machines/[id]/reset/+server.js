import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit';
import path from 'path';

const dbPath = process.env.NODE_ENV === 'production'
    ? '/app/data/database.db' // Docker production path
    : path.join(process.cwd(), 'data', 'database.db'); // Local development path
// Open a SQLite database (it creates `database.db` if it doesn’t exist)
const db = new Database(dbPath);

// get machine by id
export async function PATCH({ params }) {
    const { id } = params;

    try {
        const stmt = db.prepare(`
            UPDATE machines 
            SET current_usage = 0 
            WHERE id = ?
        `);
        const result = stmt.run(id);

        if (result.changes === 0) {
            return json({ error: 'Machine not found' }, { status: 404 });
        }

        return json({ success: true });
    } catch (error) {
        return json({ success: false, error: error.message }, { status: 500 });
    }
}
