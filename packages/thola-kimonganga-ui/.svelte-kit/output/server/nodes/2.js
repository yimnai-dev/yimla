

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D572DyHD.js","_app/immutable/chunks/disclose-version.BV7kU63y.js","_app/immutable/chunks/runtime.DwUChn-q.js","_app/immutable/chunks/stores.C2ukkQ3v.js","_app/immutable/chunks/entry.Dex6HvpP.js"];
export const stylesheets = [];
export const fonts = [];
