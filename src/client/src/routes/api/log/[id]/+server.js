import Database from 'better-sqlite3';
import { json } from '@sveltejs/kit';

// open the database
const db = new Database('./database.db', { verbose: console.log });

// log usage for a specific machine
export const POST = async ({ params, request }) => {
    const machineId = parseInt(params.id);
    const { user_name, usage_time } = await request.json();

    // Insert usage log
    db.prepare('INSERT INTO usage_logs (machine_id, user_name, usage_time) VALUES (?, ?, ?)').run(machineId, user_name, usage_time);

    // Update machine's current usage and lifetime usage
    const machine = db.prepare('SELECT current_usage, lifetime_usage FROM machines WHERE id = ?').get(machineId);
    const newCurrentUsage = machine.current_usage + usage_time;
    const newLifetimeUsage = machine.lifetime_usage + usage_time;

    db.prepare('UPDATE machines SET current_usage = ?, lifetime_usage = ? WHERE id = ?').run(newCurrentUsage, newLifetimeUsage, machineId);

    return new Response(JSON.stringify({ message: 'Usage logged successfully' }), { status: 200 });
};

// get usage logs for a specific machine (with optional limit)
export const GET = async ({ params, url }) => {
    const machineId = parseInt(params.id);
    const limit = url.searchParams.get('limit') || 10; // Default to 10 logs if no limit specified

    // Retrieve usage logs with a limit
    const logs = db.prepare('SELECT * FROM usage_logs WHERE machine_id = ? ORDER BY timestamp DESC LIMIT ?').all(machineId, limit);

    return new Response(JSON.stringify(logs), { status: 200 });
};
