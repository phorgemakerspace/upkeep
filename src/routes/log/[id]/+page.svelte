<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    export let data;
    let machine = data.machine;
    let user_name = "";
    let usage_time = 0;
    let trained = false;

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

            <div class="mb-4 ml-0">
                <input
                    id="training"
                    type="checkbox"
                    bind:checked={trained}
                    class="mr-2 ml-1 transform scale-150"
                />
                <label for="training" class="mb-4 text-xs">
                    I acknowledge that I am properly trained and authorized to
                    operate this machine.
                </label>
            </div>

            <button
                on:click={logUsage}
                class="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                disabled={!user_name ||
                    !usage_time ||
                    needsMaintenance ||
                    !trained}
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
                href="mailto:manager@phorgemakerspace.com?subject=Machine%20Issue%20Report&body=Machine%20Name%2FID%3A%20%0AMachine%20Category%3A%20%0A%0AIssue%20Description%3A%20%0A%0A- Problem%20Summary%3A%20%5BBrief%20description%20of%20the%20issue%2C%20e.g.%2C%20%22The%203D%20printer%20is%20not%20heating%20up.%22%5D%0A%0A- Detailed%20Description%3A%20%5BMore%20detailed%20explanation%20of%20the%20issue.%20Include%20any%20unusual%20noises%2C%20behaviors%2C%20or%20error%20messages%20that%20appeared.%5D%0A%0A- When%20did%20the%20issue%20occur%3F%20%5BDate%20and%20time%20the%20problem%20started%20or%20was%20first%20noticed%5D%0A%0A- Steps%20Taken%20%28if%20any%29%3A%20%5BAny%20troubleshooting%20steps%20you%20have%20already%20attempted%2C%20such%20as%20restarting%20the%20machine%20or%20adjusting%20settings.%5D%0A%0A- Machine%20Status%3A%20%5BCurrent%20status%20of%20the%20machine%2C%20e.g.%2C%20%22Machine%20is%20powered%20on%20but%20not%20responding.%22%5D%0A%0A- Additional%20Information%3A%20"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Report Issue
            </a>
        </div>
    </div>
</main>
