export async function load({ params, fetch }) {
    const res1 = await fetch(`/api/machines/${params.id}`);
    const res2 = await fetch(`/api/log/${params.id}?limit=10`);

    const logs = await res2.json();
    const machine = await res1.json()

    if (!machine) {
        return {
            status: 404,
            error: new Error("No machines found")
        };
    }

    return { machine, logs };
}