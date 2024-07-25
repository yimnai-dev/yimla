export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34')
];

export const server_loads = [0,3,4,6];

export const dictionary = {
		"/": [7],
		"/auth/forgot-password": [~10,[2]],
		"/auth/login": [~11,[2]],
		"/auth/reset-password": [~12,[2]],
		"/auth/signup": [~13,[2]],
		"/auth/verify-email": [~14,[2]],
		"/auth/[...path]": [~9,[2]],
		"/tkc": [~15,[3]],
		"/tkc/recommendations": [~17,[3]],
		"/tkc/search-history": [~18,[3]],
		"/tkc/[...path]": [~16,[3]],
		"/tko": [~19,[4]],
		"/tko/medication": [~21,[4]],
		"/tko/pharmacies": [~22,[4,5]],
		"/tko/pharmacies/new": [~24,[4,5]],
		"/tko/pharmacies/[pharmacyId]/edit": [~23,[4,5]],
		"/tko/pharmacists": [~25,[4]],
		"/tko/pharmacists/new": [~26,[4]],
		"/tko/subscriptions": [~27,[4]],
		"/tko/subscriptions/cancel": [~28,[4]],
		"/tko/subscriptions/success": [~29,[4]],
		"/tko/[...path]": [~20,[4]],
		"/tkp": [~30,[6]],
		"/tkp/medication": [~32,[6]],
		"/tkp/medication/new": [~33,[6]],
		"/tkp/search": [~34,[6]],
		"/tkp/[...path]": [~31,[6]],
		"/[...path]": [~8]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';