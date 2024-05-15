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
		client: {"start":"_app/immutable/entry/start.BTAIFD09.js","app":"_app/immutable/entry/app.DO7fOQOo.js","imports":["_app/immutable/entry/start.BTAIFD09.js","_app/immutable/chunks/entry.BFLpIk5U.js","_app/immutable/chunks/runtime.CHr_CLDv.js","_app/immutable/entry/app.DO7fOQOo.js","_app/immutable/chunks/runtime.CHr_CLDv.js","_app/immutable/chunks/render.BQEFUwHy.js","_app/immutable/chunks/disclose-version.4lT70rZg.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
