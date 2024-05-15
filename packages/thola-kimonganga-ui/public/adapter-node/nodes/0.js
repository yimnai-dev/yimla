

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BIGysWuf.js","_app/immutable/chunks/disclose-version.BV7kU63y.js","_app/immutable/chunks/runtime.DwUChn-q.js"];
export const stylesheets = ["_app/immutable/assets/0.CeAG9lh6.css"];
export const fonts = [];
