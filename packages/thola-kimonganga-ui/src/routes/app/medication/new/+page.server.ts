import type { CreateMedicationResponse } from "$lib"
import { COOKIE_KEYS } from "$lib/cookie-keys"
import { createMedicationSchema } from "$lib/forms/medication.form"
import { post } from "$lib/urls"
import { error, redirect, type Actions } from "@sveltejs/kit"
import { fail, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async () => {
    const createMedicationForm = await superValidate(zod(createMedicationSchema))
    return {
        createMedicationForm
    }
}


export const actions = {
    default: async ({ request, locals, fetch, cookies }) => {
        const form = await superValidate(request, zod(createMedicationSchema))
        if (!form.valid) {
            fail(400, { form })
        }
        const formData = new FormData()
        const detail = {
            name: form.data.name,
            description: form.data.description,
            manufacturer: form.data.manufacturer,
            category: form.data.category,
            strength: form.data.strength,
            quantity: form.data.quantity,
            price: form.data.price,
            dosageForm: form.data.dosageForm,
            expiryDate: form.data.expiryDate,
            instructions: form.data.instructions,
            storageConditions: form.data.storageConditions,
        }
        formData.append('image', form.data.image)
        formData.append('detail', JSON.stringify(detail))
        const createMedicationResponse = await post<CreateMedicationResponse, FormData>({
            url: `medication/create/${form.data.pharmacyId}`,
            input: formData,
            fetcher: fetch,
            baseURL: locals.baseURL,
            options: {
                headers: {
                    "Authorization": cookies.get(COOKIE_KEYS.SESSION_KEY) || '',
                }
            },
            isFormData: true
        })
        if (!createMedicationResponse.ok) {
            console.log('sa: ', createMedicationResponse)
            error(createMedicationResponse.status, {
                message: createMedicationResponse.message,
                status: createMedicationResponse.status
            })
        }
        redirect(303, '/app/medication')
    }
} satisfies Actions