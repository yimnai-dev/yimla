import type { InitializeSubscriptionSessionResponse, StripePriceListResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys.js';
import {
	initializeCheckoutSchema,
	type InitializeCheckoutForm
} from '$lib/forms/subscriptions.form';
import { get, post } from '$lib/urls';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, cookies, fetch, platform }) => {
	if (locals.tholaApp !== 'thola-org') {
		const path = locals.tholaApp === 'thola-pharmacy' ? '/tkp' : '/tkc';
		redirect(302, path);
	}
	return {
		publishableKey: platform?.env.VITE_STRIPE_PUBLISHABLE_TEST_KEY,
		streamed: {
			stripePriceListStream: get<StripePriceListResponse>({
				url: 'subscriptions/product-price-list',
				baseURL: locals.baseURL,
				fetcher: fetch,
				options: {
					headers: {
						Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
					}
				}
			})
		},
		initializeCheckoutForm: await superValidate(zod(initializeCheckoutSchema)),
		meta: {
			title: 'Thola Kimonganga | Subscription',
			description: 'Thola Kimonganga | Subscription',
			url: '/tko/subscriptions'
		}
	};
};

export const actions = {
	initializeSubscription: async ({ request, locals, cookies, fetch }) => {
		const form = await superValidate(request, zod(initializeCheckoutSchema));
		if (!form.valid) {
			fail(400, {
				form
			});
		}
		const initializeCheckoutResponse = await post<
			InitializeSubscriptionSessionResponse,
			Omit<InitializeCheckoutForm, 'customerId'>
		>({
			url: `subscriptions/initialize-checkout/${form.data.customerId}`,
			input: {
				seats: form.data.seats,
				priceId: form.data.priceId,
				currency: form.data.currency,
				productId: form.data.productId
			},
			baseURL: locals.baseURL,
			fetcher: fetch,
			options: {
				headers: {
					Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
				}
			}
		});
		if (!initializeCheckoutResponse.ok) {
			error(initializeCheckoutResponse.status, {
				message: initializeCheckoutResponse.message,
				status: initializeCheckoutResponse.status
			});
		}
		return {
			message: initializeCheckoutResponse.message,
			paymentUrl: initializeCheckoutResponse.paymentUrl,
			form
		};
	}
} satisfies Actions;
