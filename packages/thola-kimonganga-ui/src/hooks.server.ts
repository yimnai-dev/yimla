import { dev } from '$app/environment';
import type { VerifySessionParameters, VerifySessionResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { post } from '$lib/urls';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';


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

const handleAppHome: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/') {
		redirect(302, '/app')
	}
	return await resolve(event)
}


const setAuthorizationHeaderForProtectedRoutesHandler: Handle = async ({ event, resolve }) => {
	const sessionKey = event.cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (event.url.pathname.startsWith('/app')) {
		if (!sessionKey) {
			redirect(302, '/auth/login?redirectTo=' + event.url.pathname);
		}
		const verifySessionResponse = await post<VerifySessionResponse, VerifySessionParameters>({
			url: 'verify-session',
			input: {
				sessionKey
			},
			fetcher: event.fetch,
			baseURL: event.locals.baseURL
		})
		if(!verifySessionResponse.ok) {
			redirect(302, '/auth/login?redirectTo=' + event.url.pathname);
		}
		return await resolve(event)
	}
	return await resolve(event);
}


export const handle = sequence(handleApp, handleAppHome, setAuthorizationHeaderForProtectedRoutesHandler);