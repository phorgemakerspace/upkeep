import { writable } from "svelte/store";

export const isMobile = writable(false);

if (typeof window !== "undefined") {
    const update = () => isMobile.set(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
}