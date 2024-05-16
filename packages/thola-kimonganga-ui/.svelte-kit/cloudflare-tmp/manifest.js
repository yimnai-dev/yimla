export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.D_mcwv1Q.js","app":"_app/immutable/entry/app.BuFCFk9b.js","imports":["_app/immutable/entry/start.D_mcwv1Q.js","_app/immutable/chunks/entry.BIvqhjbk.js","_app/immutable/chunks/runtime.wKpDxbyn.js","_app/immutable/entry/app.BuFCFk9b.js","_app/immutable/chunks/runtime.wKpDxbyn.js","_app/immutable/chunks/render.C0LxGJ6e.js","_app/immutable/chunks/disclose-version.DUFzwedZ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const app_path = "_app";
