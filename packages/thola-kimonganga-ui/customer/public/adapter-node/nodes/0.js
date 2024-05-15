import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CnRwRHHj.js","_app/immutable/chunks/disclose-version.4lT70rZg.js","_app/immutable/chunks/runtime.CHr_CLDv.js","_app/immutable/chunks/render.BQEFUwHy.js"];
export const stylesheets = ["_app/immutable/assets/0.CeAG9lh6.css"];
export const fonts = [];
