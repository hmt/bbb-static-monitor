import { Writable, writable } from "svelte/store";

export const url: Writable<string> = writable(undefined);
export const status: Writable<string> = writable(undefined);
export const interval: Writable<number> = writable(parseInt(window.localStorage.getItem("interval")) || 15);
export const server: Writable<string> = writable(window.localStorage.getItem("server") || "");
export const secret: Writable<string> = writable(window.localStorage.getItem("secret") || "");
export const settings: Writable<boolean> = writable(!!(secret && server));
