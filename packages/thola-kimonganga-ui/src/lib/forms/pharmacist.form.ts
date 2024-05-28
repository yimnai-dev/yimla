import { z } from 'zod'

export const createPharmacistSchema = z.object({
    pharmacyId: z
        .string({ required_error: 'Pharmacy ID is required' }),
    firstName: z
        .string({ required_error: 'First name is required' })
        .min(1, { message: 'First name is required' }),
    lastName: z
        .string({ required_error: 'Last name is required' })
        .min(1, { message: 'Last name is required' }),
    username: z
        .string({ required_error: 'Username is required' })
        .min(1, { message: 'Username is required' }),
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email address' })
        .min(1, { message: 'Email is required' }),
    phoneNumber: z
        .string({ required_error: 'Phone number is required' })
        .min(1, { message: 'Phone number is required' })
})


export const deletePharmacistSchema = z.object({
    pharmacistId: z.string({ required_error: 'Pharmacist ID is required' })
})

export type CreatePharmacistSchema = z.infer<typeof createPharmacistSchema>

export type DeletePharmacistSchema = z.infer<typeof deletePharmacistSchema>