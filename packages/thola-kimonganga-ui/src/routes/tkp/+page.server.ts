import type { AddPharmacyToSubscriptionResponse, BaseApiResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { removeMedicationSchema, updateMedicationSchema } from '$lib/forms/medication.form';
import {
	updatePharmacyActiveStatusSchema,
	type UpdatePharmacyActiveStatusSchema
} from '$lib/forms/pharmacy.form';
import { deleteRequest, update } from '$lib/urls';
import { updateRecommendationIndex } from '$lib/utils';
import { error, fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
	const { tkp } = await parent();
	return {
		meta: {
			title: `Thola Kimonganga | ${tkp.pharmacistInfo.pharmacyName} . Pharmacy`,
			description: `Thola Kimonganga | ${tkp.pharmacistInfo.pharmacyName} . Pharmacy`,
			url: `/tkp`
		}
	};
};

export const actions = {
	updatePharmacySubscription: async ({ request, locals, cookies, fetch }) => {
		const form = await superValidate(request, zod(updatePharmacyActiveStatusSchema));
		if (!form.valid) {
			fail(400, {
				form
			});
		}
		const addPharmacyToSubscriptionResponse = await update<
			AddPharmacyToSubscriptionResponse,
			Omit<UpdatePharmacyActiveStatusSchema, 'pharmacyId'>
		>({
			url: `subscriptions/pharmacies/update/${form.data.pharmacyId}`,
			baseURL: locals.baseURL,
			fetcher: fetch,
			options: {
				headers: {
					Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
				}
			},
			input: {
				isActive: form.data.isActive
			}
		});
		if (!addPharmacyToSubscriptionResponse.ok) {
			error(addPharmacyToSubscriptionResponse.status, {
				message: addPharmacyToSubscriptionResponse.message,
				status: addPharmacyToSubscriptionResponse.status
			});
		}
		return {
			message: addPharmacyToSubscriptionResponse.message,
			form
		};
	},
	deleteMedication: async ({ request, locals, cookies, fetch }) => {
		const form = await superValidate(request, zod(removeMedicationSchema));
		if (!form.valid) {
			fail(400, {
				form
			});
		}
		const deleteMedicationResponse = await deleteRequest<BaseApiResponse>({
			url: `medication/delete/${form.data.drugId}`,
			baseURL: locals.baseURL,
			fetcher: fetch,
			options: {
				headers: {
					Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
				}
			}
		});
		if (!deleteMedicationResponse.ok) {
			error(deleteMedicationResponse.status, {
				message: deleteMedicationResponse.message,
				status: deleteMedicationResponse.status
			});
		}
		return {
			message: deleteMedicationResponse.message,
			form
		};
	},
	updateMedication: async ({ request, locals, cookies, fetch }) => {
		const form = await superValidate(request, zod(updateMedicationSchema));
		if (!form.valid) {
			fail(400, {
				form
			});
		}
		const detail: Record<string, string | number | Date> = {};
		for (const [k, v] of Object.entries(form.data)) {
			if (v && !(v instanceof File)) {
				detail[k] = v;
			}
		}
		const formData = new FormData();
		if (Object.keys(detail).length) {
			formData.append('detail', JSON.stringify(detail));
		}
		if (form.data.image) {
			formData.append('image', form.data.image);
		}
		const updateMedicationResponse = await update<BaseApiResponse, FormData>({
			url: `medication/update/${form.data.drugId}`,
			baseURL: locals.baseURL,
			fetcher: fetch,
			options: {
				headers: {
					Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
				}
			},
			input: formData,
			isFormData: true
		});
		if (!updateMedicationResponse.ok) {
			error(updateMedicationResponse.status, {
				message: updateMedicationResponse.message,
				status: updateMedicationResponse.status
			});
		}
		return {
			message: updateMedicationResponse.message,
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
