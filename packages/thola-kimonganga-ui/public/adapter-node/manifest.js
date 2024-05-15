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
		client: {"start":"_app/immutable/entry/start.DIUEjezU.js","app":"_app/immutable/entry/app.CL0u5k70.js","imports":["_app/immutable/entry/start.DIUEjezU.js","_app/immutable/chunks/entry.DMvdtUM-.js","_app/immutable/chunks/runtime.DwUChn-q.js","_app/immutable/entry/app.CL0u5k70.js","_app/immutable/chunks/runtime.DwUChn-q.js","_app/immutable/chunks/disclose-version.BV7kU63y.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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

export const base = "";