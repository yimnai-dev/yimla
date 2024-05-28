import { z } from 'zod'

export const createPharmacySchema = z.object({
    name: z.string().min(3, 'Name is required'),
    address: z.string().min(3, 'Address is required'),
    country: z.string().min(3, 'Country is required'),
    region: z.string().min(3, 'State is required'),
    city: z.string().min(3, 'City is required'),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    organisationId: z.string().uuid('Invalid organisation id'),
})

export type CreatePharmacySchema = z.infer<typeof createPharmacySchema>