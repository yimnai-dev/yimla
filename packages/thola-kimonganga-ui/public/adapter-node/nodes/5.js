

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.Bql9PkVr.js","_app/immutable/chunks/disclose-version.D1Q7yHq9.js","_app/immutable/chunks/runtime.CD23Ggyk.js"];
export const stylesheets = [];
export const fonts = [];
