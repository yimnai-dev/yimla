import { dev } from '$app/environment';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PRIVATE_MAPBOX_API_KEY, PRIVATE_STRIPE_PUBLISHABLE_TEST_KEY, PRIVATE_STRIPE_PRICING_TABLE_TEST_ID, PRIVATE_IP_IPA_KEY } from '$env/static/private';


const handleEnv: Handle = async ({ event, resolve }) => {
	if (dev && event.platform) {
		event.platform = {
			...event.platform,
			env: {
				...event.platform?.env,
				VITE_MAPBOX_API_KEY: PRIVATE_MAPBOX_API_KEY,
				VITE_STRIPE_PUBLISHABLE_TEST_KEY: PRIVATE_STRIPE_PUBLISHABLE_TEST_KEY,
				VITE_STRIPE_PRICING_TABLE_TEST_ID: PRIVATE_STRIPE_PRICING_TABLE_TEST_ID,
				VITE_IP_IPA_KEY: PRIVATE_IP_IPA_KEY
			}
		}
	}
	return await resolve(event);
}

const handleApp: Handle = async ({ event, resolve }) => {
	if (dev) {
		event.locals.tholaApp = 'thola-pharmacy';
		event.locals.baseURL = 'http://localhost:8080/api/v1/pharmacy';
		event.locals.userRole = 'pharmacist';
		return await resolve(event);
	}
	const [subdomain] = event.url.host.split('.');
	if (subdomain === 'thola-client' || subdomain === 'thola-org' || subdomain === 'thola-pharmacy') {
		event.locals.tholaApp = subdomain;
		event.locals.userRole =
			subdomain === 'thola-client'
				? 'user'
				: subdomain === 'thola-org'
					? 'organisation'
					: 'pharmacist';
		event.locals.baseURL = `https://thola-kimonganga-api.yimnai.dev/api/v1/${subdomain === 'thola-client' ? 'users' : subdomain === 'thola-org' ? 'org' : 'pharmacy'}`;
	}
	return await resolve(event);
};

const handleRequests: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/auth')) {
		return await resolve(event);
	}
	const sessionKey = event.cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) {
		redirect(302, '/auth/login?redirectTo=' + event.url.pathname);
	}
	const response = await resolve(event);
	if (response.status === 401) {
		redirect(302, '/auth/login?redirectTo=' + event.url.pathname);
	}
	if (event.url.pathname === '/') {
		const redirectPath =
			event.locals.tholaApp === 'thola-org'
				? '/tko'
				: event.locals.tholaApp === 'thola-pharmacy'
					? '/tkp'
					: '/tkc';
		redirect(302, redirectPath);
	}
	return response;
};

export const handle = sequence(handleEnv, handleApp, handleRequests);