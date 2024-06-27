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
	() => import('./nodes/30')
];

export const server_loads = [0,3,4,6];

export const dictionary = {
		"/": [7],
		"/auth/forgot-password": [~9,[2]],
		"/auth/login": [~10,[2]],
		"/auth/reset-password": [~11,[2]],
		"/auth/signup": [~12,[2]],
		"/auth/verify-email": [~13,[2]],
		"/tkc": [~14,[3]],
		"/tkc/recommendations": [15,[3]],
		"/tkc/search-history": [16,[3]],
		"/tko": [17,[4]],
		"/tko/medication": [18,[4]],
		"/tko/pharmacies": [19,[4,5]],
		"/tko/pharmacies/new": [~21,[4,5]],
		"/tko/pharmacies/[pharmacyId]/edit": [~20,[4,5]],
		"/tko/pharmacists": [~22,[4]],
		"/tko/pharmacists/new": [~23,[4]],
		"/tko/subscriptions": [~24,[4]],
		"/tko/subscriptions/cancel": [25,[4]],
		"/tko/subscriptions/success": [26,[4]],
		"/tkp": [~27,[6]],
		"/tkp/medication": [28,[6]],
		"/tkp/medication/new": [~29,[6]],
		"/tkp/search": [~30,[6]],
		"/[...path]": [~8]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';