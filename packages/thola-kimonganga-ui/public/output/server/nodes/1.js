

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BvmZ4hnW.js","_app/immutable/chunks/disclose-version.BV7kU63y.js","_app/immutable/chunks/runtime.DwUChn-q.js","_app/immutable/chunks/stores.lnpLm8Zb.js","_app/immutable/chunks/entry.BK8erq4Z.js"];
export const stylesheets = [];
export const fonts = [];
