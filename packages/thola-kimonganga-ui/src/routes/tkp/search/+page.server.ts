import type { BaseURL, MedicationSearchResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { searchMedicationParametersSchema } from '$lib/forms/medication.form';
import { get } from '$lib/urls';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
	const { tkp } = await parent();
	return {
		meta: {
			title: `Thola Kimonganga | ${tkp.pharmacistInfo.pharmacyName} . Search Medications`,
			description: `Thola Kimonganga | ${tkp.pharmacistInfo.pharmacyName} . Search Medications`,
			url: `/tkp/search`
		}
	};
};

export const actions = {
	search: async ({ request, cookies, fetch, locals }) => {
		const form = await superValidate(request, zod(searchMedicationParametersSchema));
		if (!form.valid) {
			fail(400, {
				form
			});
		}
		const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
		if (!sessionKey) {
			redirect(302, '/auth/login');
		}
		const response = await medicationSearchResponse({
			sessionKey,
			baseURL: locals.baseURL,
			searchRadius: form.data.searchRadius,
			dosageForm: form.data.dosageForm,
			searchTerm: form.data.searchTerm,
			latitude: form.data.latitude,
			longitude: form.data.longitude,
			userId: form.data.userId,
			fetcher: fetch
		});
		if (!response.ok) {
			return {
				tkc: {
					searchMedicationList: []
				},
				form
			};
		}
		return {
			tkc: {
				searchMedicationList: response.medications
			},
			form
		};
	}
} satisfies Actions;

async function medicationSearchResponse({
	dosageForm,
	searchTerm,
	searchRadius,
	sessionKey,
	latitude,
	longitude,
	baseURL,
	userId,
	fetcher
}: {
	dosageForm?: string;
	userId: string;
	searchTerm: string;
	searchRadius: number | undefined;
	sessionKey: string;
	baseURL: BaseURL;
	fetcher: typeof fetch;
	latitude: number;
	longitude: number;
}) {
	return await get<MedicationSearchResponse>({
		url: `medication/search?searchRadius=${searchRadius}&dosageForm=${dosageForm}&searchTerm=${searchTerm}&latitude=${latitude}&longitude=${longitude}&userId=${userId}`,
		baseURL: baseURL,
		options: {
			headers: {
				Authorization: sessionKey
			}
		},
		fetcher
	});
}
