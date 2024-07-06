import { updatePharmacySchema } from '$lib/forms/pharmacy.form';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	return {
		updatePharmacyForm: await superValidate(zod(updatePharmacySchema)),
		meta: {
			title: 'Thola Kimonganga | Edit Pharmacy Details',
			description: 'Thola Kimonganga | Edit Pharmacy Details',
			url: `/tko/pharmacies/${params.pharmacyId}/edit`
		}
	};
};
