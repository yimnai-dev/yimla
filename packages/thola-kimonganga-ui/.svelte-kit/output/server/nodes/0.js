import * as universal from '../entries/pages/_layout.ts.js';
import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.Bolo-tAV.js","_app/immutable/chunks/context.C9dpIilQ.js","_app/immutable/chunks/runtime.Bhf-vxpv.js","_app/immutable/chunks/entry.DX3ARJt5.js","_app/immutable/chunks/index-client.CnoYmsF-.js","_app/immutable/chunks/disclose-version.DtR1NMXz.js","_app/immutable/chunks/snippet.CBj7fh4M.js","_app/immutable/chunks/misc.w05JabWi.js","_app/immutable/chunks/render.DPGttwyb.js","_app/immutable/chunks/context-keys.CLavAaLf.js","_app/immutable/chunks/props.D_dd-OEt.js","_app/immutable/chunks/transitions.Bmz1fhPf.js","_app/immutable/chunks/index.DkWdW2MU.js","_app/immutable/chunks/Icon.JZj92Q4v.js","_app/immutable/chunks/lifecycle.DZh9mCpd.js","_app/immutable/chunks/mode.Cq9Pf7ez.js"];
export const stylesheets = ["_app/immutable/assets/0.CzswupaQ.css"];
export const fonts = [];
