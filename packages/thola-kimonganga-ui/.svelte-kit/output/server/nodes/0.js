import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CyP-f8oX.js","_app/immutable/chunks/context.DxjjbUfn.js","_app/immutable/chunks/runtime.Uw8iV3qd.js","_app/immutable/chunks/entry.C8C5xLvk.js","_app/immutable/chunks/index-client.CWvzmG2s.js","_app/immutable/chunks/disclose-version.C2_SEnP2.js","_app/immutable/chunks/snippet.LPmNMW-m.js","_app/immutable/chunks/misc.Dqzh8ow3.js","_app/immutable/chunks/render.B4iQOYLA.js","_app/immutable/chunks/context-keys.DyyZrN1U.js","_app/immutable/chunks/props.BFTgb3o-.js","_app/immutable/chunks/transitions.B5_WE3N2.js","_app/immutable/chunks/index.B1FdZY2a.js","_app/immutable/chunks/Icon.CtB0MIzX.js","_app/immutable/chunks/lifecycle.DNkYqqjM.js","_app/immutable/chunks/mode.BilI3OCx.js"];
export const stylesheets = ["_app/immutable/assets/0.CqOI0tFK.css"];
export const fonts = [];
