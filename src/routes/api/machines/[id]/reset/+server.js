import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit';

// open the database
const db = new Database('./database.db', { verbose: console.log });

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
