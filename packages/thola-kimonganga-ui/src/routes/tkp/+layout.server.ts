import type { PharmacistDetailsResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import {
	removeMedicationSchema,
	searchMedicationParametersSchema,
	updateMedicationSchema
} from '$lib/forms/medication.form';
import { get } from '$lib/urls';
import { getDeviceLocationInfo, getPharmacyMedicationList } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import { superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, cookies, fetch, setHeaders, platform }) => {
	if (locals.tholaApp !== 'thola-pharmacy') {
		redirect(302, '/auth/login');
	}

	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) {
		redirect(302, '/auth/login');
	}

	const pharmacistInfoResponse = await get<PharmacistDetailsResponse>({
		url: 'account/details',
		fetcher: fetch,
		baseURL: locals.baseURL,
		options: {
			headers: {
				Authorization: sessionKey || ''
			}
		}
	});
	setHeaders({
		'cache-control': 'max-age=3600, s-maxage=3600 must-revalidate, stale-while-revalidate'
	});
	if (!pharmacistInfoResponse.ok) {
		error(pharmacistInfoResponse.status, {
			message: pharmacistInfoResponse.message,
			status: pharmacistInfoResponse.status
		});
	}
	return {
		tkp: {
			pharmacistInfo: pharmacistInfoResponse.pharmacist,
			medicationListStream: getPharmacyMedicationList({
				cookies,
				fetcher: fetch,
				pharmacyId: pharmacistInfoResponse.pharmacist.pharmacyId,
				baseURL: locals.baseURL
			}),
			deleteMedicationForm: await superValidate(zod(removeMedicationSchema)),
			updateMedicationForm: await superValidate(zod(updateMedicationSchema)),
			searchMedicationForm: await superValidate<
				Infer<typeof searchMedicationParametersSchema>,
				{ d: string }
			>(zod(searchMedicationParametersSchema)),
			locationInfo: await getDeviceLocationInfo(platform?.env?.VITE_IP_IPA_KEY || ''),
			mapBoxApiKey: platform?.env.VITE_MAPBOX_API_KEY
		}
	};
};
