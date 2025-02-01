<script>
    // @ts-nocheck

    let newMachine = {
        name: "",
        description: "",
        current_usage: "0",
        lifetime_usage: "0",
        maintenance_interval: "0",
        category: "3D Printer",
        unit_type: "mins",
        maintenance_resource_url: "",
    };

    async function createMachine() {
        await fetch("/api/machines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMachine),
        });

        // Reset form
        newMachine = {
            name: "",
            description: "",
            current_usage: "0",
            lifetime_usage: "0",
            maintenance_interval: "0",
            category: "3D Printer",
            unit_type: "mins",
            maintenance_resource_url: "",
        };

        window.location.href = "/";
    }
</script>

<main class="container mx-auto p-6">
    <div class="">
        <h1 class="text-3xl font-bold"><a href="/">←</a> Create New</h1>
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="mb-4">
                <label for="name" class="block mb-2">Machine Name</label>
                <input
                    id="name"
                    type="text"
                    bind:value={newMachine.name}
                    class="w-full p-2 border rounded"
                />
            </div>

            <div class="mb-4">
                <label for="description" class="block mb-2">Description</label>
                <textarea
                    id="description"
                    bind:value={newMachine.description}
                    class="w-full p-2 border rounded"
                ></textarea>
            </div>

            <div class="mb-4">
                <label for="category" class="block mb-2">Category</label>
                <select
                    id="category"
                    bind:value={newMachine.category}
                    class="w-full p-2 border rounded"
                >
                    <option value="3D Printer">3D Printer</option>
                    <option value="CNC Machine">CNC Machine</option>
                </select>
            </div>

            <div class="mb-4">
                <label for="usage" class="block mb-2">Current Usage</label>
                <input
                    id="usage"
                    type="number"
                    bind:value={newMachine.current_usage}
                    min="0"
                    class="w-full p-2 border rounded"
                />
            </div>

            <div class="mb-4">
                <label for="lifetime" class="block mb-2">Lifetime Usage</label>
                <input
                    id="lifetime"
                    type="number"
                    bind:value={newMachine.lifetime_usage}
                    min="0"
                    class="w-full p-2 border rounded"
                />
            </div>

            <div class="mb-4">
                <label for="unit" class="block mb-2">Unit Type</label>
                <select
                    id="unit"
                    bind:value={newMachine.unit_type}
                    class="w-full p-2 border rounded"
                >
                    <option value="mins">Minutes</option>
                    <option value="hours">Hours</option>
                </select>
            </div>

            <div class="mb-4">
                <label for="interval" class="block mb-2"
                    >Maintenance Interval</label
                >
                <input
                    id="interval"
                    type="number"
                    bind:value={newMachine.maintenance_interval}
                    min="0"
                    class="w-full p-2 border rounded"
                />
            </div>

            <div class="mb-4">
                <label for="resource" class="block mb-2"
                    >Maintenance Resource URL</label
                >
                <input
                    id="resource"
                    type="url"
                    bind:value={newMachine.maintenance_resource_url}
                    class="w-full p-2 border rounded"
                />
            </div>

            <button
                on:click={createMachine}
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!newMachine.name || !newMachine.maintenance_interval}
            >
                Create Machine
            </button>
        </div>
    </div>
</main>
