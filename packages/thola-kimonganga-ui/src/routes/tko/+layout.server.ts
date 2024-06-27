import type { OrganisationResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { removeMedicationSchema } from '$lib/forms/medication.form';
import { deletePharmacistSchema } from '$lib/forms/pharmacist.form';
import { updatePharmacyActiveStatusSchema } from '$lib/forms/pharmacy.form';
import { get } from '$lib/urls';
import {
	getDeviceLocationInfo,
	getOrgMedicationList,
	getPharmacistList,
	getPharmacyList,
	getSubscriptionList
} from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, cookies, fetch, setHeaders, platform }) => {
	if (locals.tholaApp !== 'thola-org') {
		redirect(302, '/auth/login');
	}
	const orgDetailsResponse = await get<OrganisationResponse>({
		url: 'account/details',
		fetcher: fetch,
		baseURL: locals.baseURL,
		options: {
			headers: {
				Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
			}
		}
	});
	if (!orgDetailsResponse.ok) {
		error(orgDetailsResponse.status, {
			message: orgDetailsResponse.message,
			status: orgDetailsResponse.status
		});
	}
	setHeaders({
		'Cache-Control': 'public, max-age=3600, must-revalidate'
	});
	return {
		orgInfo: orgDetailsResponse.organisation,
		tko: {
			organisationPharmacistListResponse: getPharmacistList({
				cookies,
				fetcher: fetch,
				baseURL: locals.baseURL,
				url: `pharmacist/org/all/${orgDetailsResponse.organisation.organisationId}`
			}),
			deletePharmacistForm: await superValidate(zod(deletePharmacistSchema)),
			deleteMedicationForm: await superValidate(zod(removeMedicationSchema)),
			pharmacyListStream: getPharmacyList({
				cookies,
				fetcher: fetch,
				orgId: orgDetailsResponse.organisation.organisationId,
				baseURL: locals.baseURL
			}),
			subscriptionListStream: getSubscriptionList({
				cookies,
				fetcher: fetch,
				customerId: orgDetailsResponse.organisation.customerId,
				baseURL: locals.baseURL
			}),
			medicationListStream: getOrgMedicationList({
				cookies,
				fetcher: fetch,
				organisationId: orgDetailsResponse.organisation.organisationId,
				baseURL: locals.baseURL
			}),
			updatePharmacyActiveStatusForm: await superValidate(zod(updatePharmacyActiveStatusSchema)),
			locationInfo: await getDeviceLocationInfo(platform?.env?.VITE_IP_IPA_KEY || ''),
			organisationInfo: orgDetailsResponse.organisation
		}
	};
};
