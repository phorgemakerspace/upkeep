import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.NODE_ENV === 'production'
    ? '/app/data/database.db' // Docker production path
    : path.join(process.cwd(), 'data', 'database.db'); // Local development path
// Ensure the directory exists before opening the database
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}
// Open a SQLite database (it creates `database.db` if it doesn’t exist)
const db = new Database(dbPath);

// get machine by id
export function GET({ params }) {
    const { id } = params;
    const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(id);

    if (!machine) {
        return json({ error: 'Machine not found' }, { status: 404 });
    }
    return json(machine);
}

// update machine details
export async function PATCH({ params, request }) {
    // const req = await request.json()
    // console.log(req)
    const { id } = params;
    const { name, description, current_usage, lifetime_usage, maintenance_interval, category, unit_type, maintenance_resource_url } = await request.json();

    try {
        const stmt = db.prepare(`
            UPDATE machines 
            SET name = ?, 
                description = ?, 
                current_usage = ?, 
                lifetime_usage = ?, 
                maintenance_interval = ?, 
                category = ?, 
                unit_type = ?, 
                maintenance_resource_url = ? 
            WHERE id = ?
        `);
        const result = stmt.run(name, description, current_usage, lifetime_usage, maintenance_interval, category, unit_type, maintenance_resource_url || null, id);

        if (result.changes === 0) {
            return json({ error: 'Machine not found or no changes made' }, { status: 404 });
        }

        return json({ success: true });
    } catch (error) {
        return json({ success: false, error: error.message }, { status: 500 });
    }
}

// delete a machine and it's logs
export async function DELETE({ params }) {
    const { id } = params;

    try {
        // begin transaction
        const transaction = db.transaction(() => {
            // delete associated usage logs
            db.prepare('DELETE FROM usage_logs WHERE machine_id = ?').run(id);

            // delete the machine
            const stmt = db.prepare('DELETE FROM machines WHERE id = ?');
            const result = stmt.run(id);

            return result;
        });

        const result = transaction();

        if (result.changes === 0) {
            return json({ error: 'Machine not found' }, { status: 404 });
        }

        return json({ success: true });
    } catch (error) {
        return json({ success: false, error: error.message }, { status: 500 });
    }
}

// // delete a machine
// export async function DELETE({ params }) {
//     const { id } = params;

//     try {
//         const stmt = db.prepare('DELETE FROM machines WHERE id = ?');
//         const result = stmt.run(id);

//         if (result.changes === 0) {
//             return json({ error: 'Machine not found' }, { status: 404 });
//         }

//         return json({ success: true });
//     } catch (error) {
//         return json({ success: false, error: error.message }, { status: 500 });
//     }
// }

