import { updatePharmacySchema } from '$lib/forms/pharmacy.form';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		updatePharmacyForm: await superValidate(zod(updatePharmacySchema))
	};
};
