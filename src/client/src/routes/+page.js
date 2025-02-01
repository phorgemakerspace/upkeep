export async function load({ params, fetch }) {
    const res = await fetch('/api/machines');
    const machines = await res.json();

    if (!machines) {
        return {
            status: 404,
            error: new Error("No machines found")
        };
    }

    return { machines };
}