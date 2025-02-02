<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    export let data;
    let machine = data.machine;
    let user_name = "";
    let usage_time = 0;

    onMount(() => {
        user_name = window.localStorage.getItem("user_name") || "";
    });

    async function logUsage() {
        if (!user_name || !usage_time) return;

        window.localStorage.setItem("user_name", user_name);

        const response = await fetch(`/api/log/${data.machine.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_name, usage_time }),
        });

        if (!response.ok) {
            throw new Error("Failed to log machine usage");
        }

        window.location.href = "/log";

        // Refresh machine data
        // const response = await fetch(
        //     `http://localhost:3000/api/machines/${data.id}`,
        // );
        // machine = await response.json();
        usage_time = 0;
    }

    let usagePercentage = (
        (machine.current_usage / machine.maintenance_interval) *
        100
    ).toFixed(1);

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

    $: needsMaintenance =
        data.machine &&
        data.machine.current_usage >= data.machine.maintenance_interval;
</script>

<main class="container mx-auto p-6">
    <div>
        <h1 class="text-3xl font-bold">{machine.name}</h1>
        {#if needsMaintenance}
            <div
                class="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            >
                This machine needs maintenance!
                <br />
                <a href={machine.maintenance_resource_url} class="underline">
                    View maintenance guide
                </a>
            </div>
        {/if}
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="mb-4">
                <label for="name" class="block mb-2">Email</label>
                <input
                    id="name"
                    type="text"
                    bind:value={user_name}
                    class="w-full p-2 border rounded"
                />
            </div>

            <div class="mb-4">
                <label for="usage" class="block mb-2"
                    >Usage Time ({machine.unit_type})</label
                >
                <input
                    id="usage"
                    type="number"
                    bind:value={usage_time}
                    min="0"
                    class="w-full p-2 border rounded"
                />
            </div>

            <button
                on:click={logUsage}
                class="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600"
                disabled={!user_name || !usage_time || needsMaintenance}
            >
                Log Usage
            </button>
        </div>
    </div>
    <div class="bg-white rounded-lg shadow-lg p-6 pt-0">
        <div class="mt-8 flex justify-between items-center">
            <span class="text-xl font-semibold mb-2">Machine Status</span>
            <span
                class={`px-2 py-1 rounded text-sm ${getStatusStyle(usagePercentage)}`}
            >
                {Number(usagePercentage) >= 100
                    ? "Maintenance Required"
                    : Number(usagePercentage) >= 80
                      ? "Warning"
                      : "Healthy"}
            </span>
        </div>
        <span class="text-sm text-gray-600"
            >{machine.current_usage}/{machine.maintenance_interval}
            {machine.unit_type} ({usagePercentage}%)</span
        >

        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div
                class={`h-2.5 rounded-full ${getUsageBarStyle(usagePercentage)}`}
                style={`width: ${Math.min(Number(usagePercentage), 100)}%`}
            ></div>
        </div>
        <div class="mt-8 text-center">
            <a
                href="mailto:manager@phorgemakerspace.com"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Report Issue
            </a>
        </div>
    </div>
</main>
