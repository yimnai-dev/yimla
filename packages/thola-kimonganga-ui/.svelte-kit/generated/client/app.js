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
	() => import('./nodes/24')
];

export const server_loads = [0,2,3];

export const dictionary = {
		"/": [6],
		"/app": [~7,[2]],
		"/app/medication": [~8,[2]],
		"/app/medication/new": [~9,[2]],
		"/app/pharmacies": [10,[2,3]],
		"/app/pharmacies/new": [~14,[2,3]],
		"/app/pharmacies/[pharmacyId]": [11,[2,3]],
		"/app/pharmacies/[pharmacyId]/edit": [12,[2,3]],
		"/app/pharmacies/[pharmacyId]/pharmacists": [13,[2,3]],
		"/app/pharmacists": [~15,[2,4]],
		"/app/pharmacists/new": [~16,[2,4]],
		"/app/subscriptions": [~17,[2]],
		"/app/subscriptions/cancel": [18,[2]],
		"/app/subscriptions/success": [19,[2]],
		"/auth/forgot-password": [~20,[5]],
		"/auth/login": [~21,[5]],
		"/auth/reset-password": [~22,[5]],
		"/auth/signup": [~23,[5]],
		"/auth/verify-email": [~24,[5]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';