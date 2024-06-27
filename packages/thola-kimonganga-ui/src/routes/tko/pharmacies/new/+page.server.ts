import { createPharmacySchema, type CreatePharmacySchema } from '$lib/forms/pharmacy.form';
import { error, fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { post } from '$lib/urls';
import { zod } from 'sveltekit-superforms/adapters';
import type { CreatePharmacyResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';

export const load = async ({ platform }) => {
	const createPharmacyForm = await superValidate(zod(createPharmacySchema));
	return { createPharmacyForm, mapBoxApiKey: platform?.env.VITE_MAPBOX_API_KEY };
};

export const actions = {
	default: async ({ request, locals, fetch, cookies }) => {
		const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
		const form = await superValidate(request, zod(createPharmacySchema));
		if (!form.valid) {
			fail(400, { createPharmacyForm: form });
		}
		const createPharmacyResponse = await post<
			CreatePharmacyResponse,
			Omit<CreatePharmacySchema, 'organisationId'>
		>({
			url: `pharmacy/create/${form.data.organisationId}`,
			input: {
				name: form.data.name,
				country: form.data.country,
				address: form.data.address,
				city: form.data.city,
				longitude: form.data.longitude,
				latitude: form.data.latitude,
				region: form.data.region
			},
			fetcher: fetch,
			baseURL: locals.baseURL,
			options: {
				headers: {
					Authorization: sessionKey || ''
				}
			}
		});
		if (!createPharmacyResponse.ok) {
			error(createPharmacyResponse.status, {
				message: createPharmacyResponse.message,
				status: createPharmacyResponse.status
			});
		}
		return {
			message: createPharmacyResponse.message,
			status: 200,
			form
		};
	}
} satisfies Actions;
