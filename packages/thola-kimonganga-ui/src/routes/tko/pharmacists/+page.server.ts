import type { DeletePharmacistResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { deletePharmacistSchema } from '$lib/forms/pharmacist.form';
import { deleteRequest } from '$lib/urls';
import { error, type Actions } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		meta: {
			title: 'Thola Kimonganga | Organisation Pharmacists',
			description: 'Thola Kimonganga | Organisation Pharmacists',
			url: '/tko/pharmacists'
		}
	};
};

export const actions = {
	deletePharmacist: async ({ request, locals, fetch, cookies }) => {
		const form = await superValidate(request, zod(deletePharmacistSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const deletePharmacistResponse = await deleteRequest<DeletePharmacistResponse>({
			url: `pharmacist/delete/${form.data.pharmacistId}`,
			fetcher: fetch,
			baseURL: locals.baseURL,
			options: {
				headers: {
					Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
				}
			}
		});
		if (!deletePharmacistResponse.ok) {
			error(deletePharmacistResponse.status, {
				message: deletePharmacistResponse.message,
				status: deletePharmacistResponse.status
			});
		}
		return {
			message: deletePharmacistResponse.message
		};
	}
} satisfies Actions;
