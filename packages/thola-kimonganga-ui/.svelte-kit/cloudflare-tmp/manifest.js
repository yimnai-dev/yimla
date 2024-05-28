export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","images/placeholder-user.webp"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.BQKu8JTU.js","app":"_app/immutable/entry/app.5EJvniNT.js","imports":["_app/immutable/entry/start.BQKu8JTU.js","_app/immutable/chunks/entry.DX3ARJt5.js","_app/immutable/chunks/index-client.CnoYmsF-.js","_app/immutable/chunks/runtime.Bhf-vxpv.js","_app/immutable/entry/app.5EJvniNT.js","_app/immutable/chunks/runtime.Bhf-vxpv.js","_app/immutable/chunks/render.DPGttwyb.js","_app/immutable/chunks/disclose-version.DtR1NMXz.js","_app/immutable/chunks/props.D_dd-OEt.js","_app/immutable/chunks/svelte-component.DG8WHjyG.js","_app/immutable/chunks/this.2d3mUT6l.js","_app/immutable/chunks/index-client.CnoYmsF-.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js')),
			__memo(() => import('../output/server/nodes/9.js')),
			__memo(() => import('../output/server/nodes/10.js')),
			__memo(() => import('../output/server/nodes/11.js')),
			__memo(() => import('../output/server/nodes/12.js')),
			__memo(() => import('../output/server/nodes/13.js')),
			__memo(() => import('../output/server/nodes/14.js')),
			__memo(() => import('../output/server/nodes/15.js')),
			__memo(() => import('../output/server/nodes/16.js')),
			__memo(() => import('../output/server/nodes/17.js')),
			__memo(() => import('../output/server/nodes/18.js')),
			__memo(() => import('../output/server/nodes/19.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/app",
				pattern: /^\/app\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/app/pharmacies",
				pattern: /^\/app\/pharmacies\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/app/pharmacies/new",
				pattern: /^\/app\/pharmacies\/new\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/app/pharmacies/[pharmacyId]",
				pattern: /^\/app\/pharmacies\/([^/]+?)\/?$/,
				params: [{"name":"pharmacyId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/app/pharmacies/[pharmacyId]/edit",
				pattern: /^\/app\/pharmacies\/([^/]+?)\/edit\/?$/,
				params: [{"name":"pharmacyId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/app/pharmacies/[pharmacyId]/pharmacists",
				pattern: /^\/app\/pharmacies\/([^/]+?)\/pharmacists\/?$/,
				params: [{"name":"pharmacyId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/app/pharmacists",
				pattern: /^\/app\/pharmacists\/?$/,
				params: [],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/app/pharmacists/new",
				pattern: /^\/app\/pharmacists\/new\/?$/,
				params: [],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/auth/forgot-password",
				pattern: /^\/auth\/forgot-password\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/auth/reset-password",
				pattern: /^\/auth\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/auth/signup",
				pattern: /^\/auth\/signup\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/auth/verify-email",
				pattern: /^\/auth\/verify-email\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 19 },
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
