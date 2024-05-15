

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CKEA3JvE.js","_app/immutable/chunks/disclose-version.BV7kU63y.js","_app/immutable/chunks/runtime.DwUChn-q.js","_app/immutable/chunks/stores.lnpLm8Zb.js","_app/immutable/chunks/entry.BK8erq4Z.js"];
export const stylesheets = [];
export const fonts = [];
