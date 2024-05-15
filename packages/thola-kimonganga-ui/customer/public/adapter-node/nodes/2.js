

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.YigFXPU9.js","_app/immutable/chunks/disclose-version.4lT70rZg.js","_app/immutable/chunks/runtime.CHr_CLDv.js"];
export const stylesheets = [];
export const fonts = [];
