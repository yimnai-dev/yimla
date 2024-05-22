import { dev } from '$app/environment';
import type { VerifySessionResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import ky from 'ky';

const PROTECTED_ROUTES = ['dashboard', '/settings'];

const handleApp: Handle = async ({ event, resolve }) => {
	if (dev) {
		event.locals.tholaApp = 'thola-org';
		event.locals.baseURL = 'http://localhost:8080/api/v1/org';
		event.locals.userRole = 'organisation'
		return await resolve(event);
	}
	const [subdomain] = event.url.host.split('.');
	if (subdomain === 'thola-client' || subdomain === 'thola-org' || subdomain === 'thola-pharmacy') {
		event.locals.tholaApp = subdomain;
		event.locals.userRole = subdomain === 'thola-client' ? 'user' : subdomain === 'thola-org' ? 'organisation' : 'pharmacy';
		event.locals.baseURL = `https://thola-kimonganga-api.yimnai.dev/api/v1/${subdomain === 'thola-client' ? 'users' : subdomain === 'thola-org' ? 'org' : 'pharmacy'}`
	}
	return await resolve(event);
};

const handleProtectedRoutes: Handle = async ({ event, resolve }) => {
	const currentPathname = event.url.pathname;
	const sessionKey = event.cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (PROTECTED_ROUTES.some(r => r.includes(currentPathname))) {
		if (!sessionKey) {
			redirect(302, '/auth/login?redirectTo=' + currentPathname);
		}
		const verifySessionResponse = await ky.post(`${event.locals.baseURL}/verify-session`, {
			json: {
				sessionKey
			}
		}).json<VerifySessionResponse>()
		console.log("targettin..lll")
		if (!verifySessionResponse.ok) {
			redirect(302, '/auth/login?redirectTo=' + currentPathname);
		}
		event.setHeaders({
			'Authorization': `${sessionKey}`
		})
		return await resolve(event);
	}
	return await resolve(event);
}

export const handle = sequence(handleApp, handleProtectedRoutes);

