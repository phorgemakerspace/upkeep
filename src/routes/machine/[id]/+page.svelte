<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { isMobile } from "$lib/stores.js";
    import QRCode from "qrcode";

    export let data;

    // Machine data state
    let machine = data.machine;
    let isLoading = true;
    let isEditing = false;
    let editedMachine = null;
    let logs = data.logs;
    let qrCodeDataUrl = "";
    let usagePercentage = (
        (machine.current_usage / machine.maintenance_interval) *
        100
    ).toFixed(1);

    // Ref for canvas element
    let qrCanvas;

    onMount(async () => {
        await generateQRCode();
    });

    async function generateQRCode() {
        if (!machine) return;

        // const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5173";
        const baseUrl =
            typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:3000";
        const logUrl = `${baseUrl}/log/${machine.id}`; // Creates URL like http://localhost:3000/log/123

        try {
            qrCodeDataUrl = await QRCode.toDataURL(logUrl, {
                width: 200,
                margin: 0,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            });
        } catch (err) {
            console.error("Failed to generate QR code:", err);
        } finally {
            isLoading = false;
        }
    }

    function downloadQRCode() {
        const link = document.createElement("a");
        link.download = `${machine.name.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
        link.href = qrCodeDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function startEditing() {
        editedMachine = { ...machine };
        isEditing = true;
    }

    function cancelEditing() {
        editedMachine = null;
        isEditing = false;
    }

    async function deleteMachine() {
        try {
            const response = await fetch(`/api/machines/${machine.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Failed to save machine:", error);
        }
    }

    async function resetMachine() {
        try {
            const response = await fetch(`/api/machines/${machine.id}/reset`, {
                method: "PATCH",
            });

            if (response.ok) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Failed to save machine:", error);
        }
    }

    async function saveMachine() {
        try {
            const response = await fetch(`/api/machines/${machine.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedMachine),
            });

            if (response.ok) {
                machine = editedMachine;
                isEditing = false;
                editedMachine = null;
                // regenerate QR code with updated info
                generateQRCode();
            }
        } catch (error) {
            console.error("Failed to save machine:", error);
        }
    }

    function getStatusStyle(usagePercentage) {
        if (usagePercentage >= 100) return "bg-red-100 text-red-800";
        if (usagePercentage >= 80) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }
</script>

<main class="container mx-auto p-6">
    {#if isLoading}
        <div class="text-center py-8">
            <p class="text-gray-600">Loading machine details...</p>
        </div>
    {:else if machine}
        <div class="mb-6 flex justify-between items-center">
            <h1 class="text-3xl font-bold"><a href="/">←</a> {machine.name}</h1>
            {#if !isEditing}
                <button
                    on:click={startEditing}
                    class="bg-blue-500 px-3 py-2 border rounded hover:bg-blue-600"
                >
                    <img
                        src="/edit.svg"
                        class="w-[25px] filter invert"
                        alt="edit"
                    />
                </button>
            {:else}
                <div>
                    <button
                        on:click={cancelEditing}
                        class="bg-red-500 px-3 py-2 border rounded hover:bg-red-600"
                    >
                        <img
                            src="/cancel.svg"
                            class="w-[25px] filter invert"
                            alt="cancel"
                        />
                    </button>
                    <button
                        on:click={saveMachine}
                        class="bg-green-500 px-3 py-2 rounded hover:bg-green-600"
                    >
                        <img
                            src="/save.svg"
                            class="w-[25px] filter invert"
                            alt="save"
                        />
                    </button>
                </div>
            {/if}
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- First two columns for machine details -->
                <div class="md:col-span-2">
                    {#if isEditing}
                        <!-- Edit Mode -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label
                                        for="name"
                                        class="block mb-2 font-medium"
                                        >Machine Name</label
                                    >
                                    <input
                                        id="name"
                                        type="text"
                                        bind:value={editedMachine.name}
                                        class="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="description"
                                        class="block mb-2 font-medium"
                                        >Description</label
                                    >
                                    <textarea
                                        id="description"
                                        bind:value={editedMachine.description}
                                        class="w-full p-2 border rounded"
                                        rows="1"
                                    ></textarea>
                                </div>

                                <div>
                                    <label
                                        for="unit"
                                        class="block mb-2 font-medium"
                                        >Unit Type</label
                                    >
                                    <select
                                        id="unit"
                                        bind:value={editedMachine.unit_type}
                                        class="w-full p-2 border rounded"
                                    >
                                        <option value="mins">Minutes</option>
                                        <option value="hours">Hours</option>
                                    </select>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label
                                        for="interval"
                                        class="block mb-2 font-medium"
                                        >Maintenance Interval</label
                                    >
                                    <input
                                        id="interval"
                                        type="number"
                                        bind:value={editedMachine.maintenance_interval}
                                        class="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="current"
                                        class="block mb-2 font-medium"
                                        >Current Usage</label
                                    >
                                    <input
                                        id="current"
                                        type="number"
                                        bind:value={editedMachine.current_usage}
                                        class="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label
                                        for="resource"
                                        class="block mb-2 font-medium"
                                        >Maintenance Resource URL</label
                                    >
                                    <input
                                        id="resource"
                                        type="url"
                                        bind:value={editedMachine.maintenance_resource_url}
                                        class="w-full p-2 border rounded"
                                    />
                                </div>
                                <div class="mt-6 flex justify-center space-x-1">
                                    <button
                                        on:click={deleteMachine}
                                        class="bg-red-500 px-3 py-2 border rounded hover:bg-red-600"
                                    >
                                        <img
                                            src="/delete.svg"
                                            class="w-[25px] filter invert"
                                            alt="delete"
                                        />
                                    </button>
                                    <button
                                        on:click={resetMachine}
                                        class="bg-yellow-500 px-3 py-2 border rounded hover:bg-yellow-600"
                                    >
                                        <img
                                            src="/reset.svg"
                                            class="w-[25px] filter invert"
                                            alt="reset"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- <div class="mt-6 flex justify-center space-x-4">
                            <button
                                on:click={deleteMachine}
                                class="bg-red-500 px-4 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                on:click={resetMachine}
                                class="bg-yellow-500 px-4 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Reset
                            </button>
                            <button
                                on:click={cancelEditing}
                                class="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                on:click={saveMachine}
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div> -->
                    {:else}
                        <!-- View Mode -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="font-medium text-gray-500">
                                        Description
                                    </h3>
                                    <p class="mt-1">{machine.description}</p>
                                </div>

                                <div>
                                    <h3 class="font-medium text-gray-500">
                                        Current Usage
                                    </h3>
                                    <p class="mt-1">
                                        {machine.current_usage}
                                        {machine.unit_type}
                                    </p>
                                </div>

                                <div>
                                    <h3 class="font-medium text-gray-500">
                                        Lifetime Usage
                                    </h3>
                                    <p class="mt-1">
                                        {machine.lifetime_usage}
                                        {machine.unit_type}
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <h3 class="font-medium text-gray-500">
                                        Maintenance Interval
                                    </h3>
                                    <p class="mt-1">
                                        {machine.maintenance_interval}
                                        {machine.unit_type}
                                    </p>
                                </div>

                                <div>
                                    <h3 class="font-medium text-gray-500">
                                        Usage Status
                                    </h3>
                                    <div class="mt-1">
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
                                </div>

                                {#if machine.maintenance_resource_url}
                                    <div>
                                        <h3 class="font-medium text-gray-500">
                                            Maintenance Resource
                                        </h3>
                                        <a
                                            href={machine.maintenance_resource_url}
                                            target="_blank"
                                            class="mt-1 text-blue-500 hover:underline"
                                        >
                                            View Resource
                                        </a>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Third column for QR code -->
                <div class="flex flex-col items-center justify-start">
                    <!-- <h3 class="font-medium text-gray-500">Machine QR Code</h3> -->
                    {#if !$isMobile}
                        {#if qrCodeDataUrl}
                            <img
                                src={qrCodeDataUrl}
                                alt="Machine QR Code"
                                class="mb-4"
                            />
                            <button
                                on:click={downloadQRCode}
                                class="bg-green-500 text-white px-4 py-2 w-3/4 rounded hover:bg-green-600"
                            >
                                Download QR Code
                            </button>
                        {/if}
                    {/if}
                    <a
                        href="/log/{machine.id}"
                        class="bg-blue-500 text-white text-center px-4 py-2 m-4 w-3/4 rounded hover:bg-blue-600"
                    >
                        Log Usage
                    </a>
                </div>
            </div>
        </div>

        <!-- Usage Log -->
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Usage Log</h2>
            <div class="overflow-x-auto">
                {#if logs.length == 0}
                    <p>no logs found.</p>
                {:else}
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="text-left p-3 border-b">Timestamp</th
                                >
                                <th class="text-left p-3 border-b"
                                    >Usage ({machine.unit_type})</th
                                >
                                <th class="text-left p-3 border-b">User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each logs as log}
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="p-3"
                                        >{formatDate(log.timestamp)}</td
                                    >
                                    <td class="p-3"
                                        >{log.usage_time}
                                        {machine.unit_type}</td
                                    >
                                    <td class="p-3">{log.user_name || "-"}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        </div>
    {:else}
        <div class="text-center py-8">
            <p class="text-gray-600">Machine not found</p>
        </div>
    {/if}
</main>
