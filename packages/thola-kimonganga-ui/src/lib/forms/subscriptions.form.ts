import {z} from 'zod'

export const initializeCheckoutSchema = z.object({
    seats: z.coerce.number().min(1, {message: 'Number of seats must be at least 1'}).default(1),
    customerId: z.string({required_error: 'Customer ID is required', invalid_type_error: 'Customer ID Is Invalid'}),
    priceId: z.string(),
    currency: z.string(),
    productId: z.string()
})

export type InitializeCheckoutForm = z.infer<typeof initializeCheckoutSchema>