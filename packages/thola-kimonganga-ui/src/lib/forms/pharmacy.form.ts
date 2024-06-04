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

export const updatePharmacyActiveStatusSchema = z.object({
    pharmacyId: z.string().uuid('Invalid pharmacy id'),
    isActive: z.boolean({
        invalid_type_error: 'Active status is required'
    })
})

export const removePharmacyFromSubscriptionSchema = z.object({
    pharmacyId: z.string().uuid('Invalid pharmacy id')
})

export type CreatePharmacySchema = z.infer<typeof createPharmacySchema>

export type UpdatePharmacyActiveStatusSchema = z.infer<typeof updatePharmacyActiveStatusSchema>

export type RemovePharmacyFromSubscriptionSchema = z.infer<typeof removePharmacyFromSubscriptionSchema>