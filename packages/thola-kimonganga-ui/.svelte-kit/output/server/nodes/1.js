

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BOP6fmql.js","_app/immutable/chunks/disclose-version.BV7kU63y.js","_app/immutable/chunks/runtime.DwUChn-q.js","_app/immutable/chunks/stores.C2ukkQ3v.js","_app/immutable/chunks/entry.Dex6HvpP.js"];
export const stylesheets = [];
export const fonts = [];
