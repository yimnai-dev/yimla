import { z } from 'zod';

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const drugDosageForm = z.enum(
	['tablet', 'capsule', 'powder', 'liquid', 'inhalation', 'injection', 'other'],
	{ required_error: 'Dosage form is required', invalid_type_error: 'Invalid dosage form' }
);

export const createMedicationSchema = z
	.object({
		pharmacyId: z.string({ required_error: 'Pharmacy ID is required' }),
		name: z.string({ required_error: 'Name is required' }),
		description: z.string({ required_error: 'Description is required' }),
		manufacturer: z.string({ required_error: 'Manufacturer is required' }),
		expiryDate: z.date({ required_error: 'Expiry date is required' }).optional(),
		category: z.string({ required_error: 'Category is required' }),
		strength: z.string({ required_error: 'Strength is required' }),
		quantity: z.coerce.number({ required_error: 'Quantity is required' }).min(1).default(1),
		price: z.coerce.number({ required_error: 'Price is required' }).min(1).default(1),
		dosageForm: drugDosageForm,
		instructions: z.string().optional(),
		storageConditions: z.string().optional(),
		image: z.instanceof(File)
	})
	.superRefine(({ image }, ctx) => {
		if (!image) {
			ctx.addIssue({
				path: ['image'],
				code: 'custom',
				message: 'Drug Image is required'
			});
		}
		if (image.size > MAX_FILE_SIZE) {
			ctx.addIssue({
				path: ['image'],
				code: 'custom',
				message: 'Drug Image is too large'
			});
		}
		if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
			ctx.addIssue({
				path: ['image'],
				code: 'custom',
				message: 'Drug Image must be in either JPEG, JPG, PNG or WEBP format'
			});
		}
	});

export const updateMedicationSchema = z.object({
	drugId: z.string({ required_error: 'Drug ID is required' }),
	quantity: z.coerce.number().optional(),
	price: z.coerce.number().optional(),
	expiryDate: z.date().optional(),
	image: z.instanceof(File).optional(),
	instructions: z.string().optional(),
	storageConditions: z.string().optional(),
	description: z.string().optional()
});

export const removeMedicationSchema = z.object({
	drugId: z.string({ required_error: 'Drug ID is required' }).uuid()
});

export const cartItem = z.object({
	drugId: z.string({ required_error: 'Drug ID is required', invalid_type_error: 'Invalid drug ID' }).uuid(),
	quantity: z.coerce.number({ required_error: 'Quantity is required', invalid_type_error: 'Invalid quantity' }).min(1),
	unitPrice: z.coerce.number({ required_error: 'Price is required', invalid_type_error: 'Invalid price' }).min(1),
	name: z.string({ required_error: 'Name is required', invalid_type_error: 'Invalid name' }),
})

export const cartSchema = z.array(cartItem);


export const searchMedicationSchema = z.object({
	drugId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	manufacturer: z.string().optional(),
	expiryDate: z.string(),
	category: z.string().optional(),
	strength: z.string().optional(),
	dosageForm: z.string().optional(),
	instructions: z.string().optional(),
	storageConditions: z.string().optional(),
	stockId: z.string(),
	quantity: z.coerce.number(),
	price: z.coerce.number(),
	pharmacyId: z.string(),
	pharmacyName: z.string(),
	city: z.string(),
	address: z.string().optional(),
	googleMapsUrl: z.string()
})

export const searchMedicationParametersSchema = z.object({
	searchRadius: z.coerce.number().default(100000).optional(),
	dosageForm: drugDosageForm.optional(),
	searchTerm: z.string().min(1).trim(),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
	userId: z.string()
})

export const medicationSearchCacheSchema = z.record(z.string(), z.array(searchMedicationSchema));

export type CreateMedicationSchema = z.infer<typeof createMedicationSchema>;

export type RemoveMedicationSchema = z.infer<typeof removeMedicationSchema>;

export type UpdateMedicationSchema = z.infer<typeof updateMedicationSchema>;

export type SearchMedicationSchema = z.infer<typeof searchMedicationSchema>;

export type MedicationSearchCacheSchema = z.infer<typeof medicationSearchCacheSchema>;

export type  SearchMedicationParametersSchema = z.infer<typeof searchMedicationParametersSchema>;

export type CartItem = z.infer<typeof cartItem>;

export type CartSchema = z.infer<typeof cartSchema>;
