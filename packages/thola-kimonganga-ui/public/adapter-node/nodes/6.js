

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tkc/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CW5fN_hR.js","_app/immutable/chunks/disclose-version.D1Q7yHq9.js","_app/immutable/chunks/runtime.CD23Ggyk.js"];
export const stylesheets = [];
export const fonts = [];
