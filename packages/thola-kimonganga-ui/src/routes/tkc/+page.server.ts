import type { BaseURL, MedicationSearchResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { searchMedicationParametersSchema } from '$lib/forms/medication.form';
import { get } from '$lib/urls';
import { updateRecommendationIndex } from '$lib/utils';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		meta: {
			title: 'Thola Kimonganga | Home',
			description: 'Thola Kimonganga | Home',
			url: '/tkc'
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
	},
	updateRecommendation: async ({ request, cookies, fetch, locals }) => {
		const formData = await request.formData();
		const medicationId = formData.get('medicationId') as string;
		const userId = formData.get('userId') as string;
		await updateRecommendationIndex({
			userId,
			medicationId,
			cookies,
			fetcher: fetch,
			baseURL: locals.baseURL
		});
		return {
			update: true
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
