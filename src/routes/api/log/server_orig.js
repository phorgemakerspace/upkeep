import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit';

// open the database
const db = new Database('./database.db', { verbose: console.log });

// log machine usage and update usage values
export async function POST({ request }) {
    const { machine_id, user_name, usage_time } = await request.json();

    try {
        // Start a transaction
        const transaction = db.transaction(() => {
            // Insert log entry
            const logStmt = db.prepare(`
                INSERT INTO usage_logs (machine_id, user_name, usage_time) 
                VALUES (?, ?, ?)
            `);
            logStmt.run(machine_id, user_name, usage_time);

            // Update machine usage
            const updateStmt = db.prepare(`
                UPDATE machines 
                SET current_usage = current_usage + ?, 
                    lifetime_usage = lifetime_usage + ? 
                WHERE id = ?
            `);
            updateStmt.run(usage_time, usage_time, machine_id);
        });

        transaction(); // Execute transaction

        return json({ success: true });
    } catch (error) {
        return json({ success: false, error: error.message }, { status: 500 });
    }
}
