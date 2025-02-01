<script>
    // @ts-nocheck
    export let data;

    let machines = data.machines;
    let isLoading = true;

    let maintenanceStatus = {
        needsMaintenance: 0,
        healthy: 0,
    };
    let categorizedMachines = {};

    async function loadPage() {
        try {
            if (machines) {
                processData();
            } else {
                console.log("No machines found");
            }
        } catch (error) {
            console.error("Failed to fetch machines:", error);
        } finally {
            isLoading = false;
        }
    }

    function processData() {
        maintenanceStatus = machines.reduce(
            (acc, machine) => {
                // Convert values to numbers to ensure proper comparison
                const currentUsage = Number(machine.current_usage);
                const maintenanceInterval = Number(
                    machine.maintenance_interval,
                );

                if (currentUsage >= maintenanceInterval) {
                    acc.needsMaintenance++;
                } else {
                    acc.healthy++;
                }
                return acc;
            },
            { needsMaintenance: 0, healthy: 0 },
        );

        // Process and sort machines, then group by category
        machines = machines
            .map((machine) => ({
                ...machine,
                usagePercentage: (
                    (machine.current_usage / machine.maintenance_interval) *
                    100
                ).toFixed(1),
            }))
            .sort((a, b) => b.usagePercentage - a.usagePercentage);

        // Group machines by category
        categorizedMachines = machines.reduce((acc, machine) => {
            const category = machine.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(machine);
            return acc;
        }, {});
    }

    // Function to determine status style
    function getStatusStyle(usagePercentage) {
        const percentage = Number(usagePercentage);
        if (percentage >= 100) return "bg-red-100 text-red-800";
        if (percentage >= 80) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    }

    // Function to determine usage bar style
    function getUsageBarStyle(usagePercentage) {
        const percentage = Math.min(Number(usagePercentage), 100);
        const backgroundColor =
            percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                  ? "bg-yellow-500"
                  : "bg-green-500";
        return `${backgroundColor} w-[${percentage}%]`;
    }

    loadPage();
</script>

<div class="container mx-auto p-6">
    <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold">Equipment Status</h1>
        <a
            href="/create"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >Create New</a
        >
    </div>

    {#if isLoading}
        <div class="text-center py-8">
            <p class="text-gray-600">Loading status...</p>
        </div>
    {:else}
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <!-- <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2">Total Machines</h3>
                <p class="text-3xl font-bold text-blue-600">
                    {machines.length}
                </p>
            </div> -->

            <div class="bg-red-200 rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2 text-red-600">
                    Needs Maintenance
                </h3>
                <p class="text-3xl font-bold text-red-600">
                    {maintenanceStatus.needsMaintenance}
                </p>
            </div>

            <div class="bg-green-200 rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-2 text-green-600">
                    Healthy Machines
                </h3>
                <p class="text-3xl font-bold text-green-600">
                    {maintenanceStatus.healthy}
                </p>
            </div>
        </div>

        <!-- Detailed Machine Status Tables by Category -->
        {#each Object.entries(categorizedMachines) as [category, categoryMachines]}
            <div class="bg-white rounded-lg shadow p-6 overflow-hidden mb-8">
                <h2 class="text-xl font-semibold mb-4">{category}</h2>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="text-left p-3 border-b">Machine</th>
                                <th class="text-left p-3 border-b">Current</th>
                                <th class="text-left p-3 border-b">Limit</th>
                                <th class="text-left p-3 border-b">Usage</th>
                                <th class="text-left p-3 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each categoryMachines as machine}
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3">
                                        <div class="font-medium">
                                            <a href="/machine/{machine.id}"
                                                >{machine.name}</a
                                            >
                                        </div>
                                    </td>
                                    <td class="p-3">
                                        {machine.current_usage}
                                        {machine.unit_type}
                                    </td>
                                    <td class="p-3">
                                        {machine.maintenance_interval}
                                        {machine.unit_type}
                                    </td>
                                    <td class="p-3">
                                        <div
                                            class="w-full bg-gray-200 rounded-full h-2.5 mb-1"
                                        >
                                            <div
                                                class={`h-2.5 rounded-full ${getUsageBarStyle(machine.usagePercentage)}`}
                                                style={`width: ${Math.min(Number(machine.usagePercentage), 100)}%`}
                                            ></div>
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            {machine.usagePercentage}%
                                        </div>
                                    </td>
                                    <td class="p-3">
                                        <span
                                            class={`px-2 py-1 rounded text-sm ${getStatusStyle(machine.usagePercentage)}`}
                                        >
                                            {Number(machine.usagePercentage) >=
                                            100
                                                ? "Maintenance Required"
                                                : Number(
                                                        machine.usagePercentage,
                                                    ) >= 80
                                                  ? "Warning"
                                                  : "Healthy"}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/each}
    {/if}
</div>
