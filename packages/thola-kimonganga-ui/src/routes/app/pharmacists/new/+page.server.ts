import type { CreatePharmacistResponse } from "$lib"
import { COOKIE_KEYS } from "$lib/cookie-keys"
import { createPharmacistSchema, type CreatePharmacistSchema } from "$lib/forms/pharmacist.form"
import { post } from "$lib/urls"
import { error, redirect, type Actions } from "@sveltejs/kit"
import { fail, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async ({ locals }) => {
    if (locals.tholaApp !== 'thola-org') {
        redirect(302, '/app');
    }
    const createPharmacistForm = await superValidate(zod(createPharmacistSchema))
    return { createPharmacistForm }
}

export const actions = {
    default: async ({ request, locals, fetch, cookies }) => {
        const form = await superValidate(request, zod(createPharmacistSchema))
        console.log('formData: ', form.data)
        if (!form.valid) {
            fail(400, { form })
        }
        const createPharmacistResponse = await post<CreatePharmacistResponse, Omit<CreatePharmacistSchema, 'pharmacyId'>>({
            url: `pharmacist/create/${form.data.pharmacyId}`,
            input: {
                firstName: form.data.firstName,
                lastName: form.data.lastName,
                email: form.data.email,
                username: form.data.username,
                phoneNumber: form.data.phoneNumber,
            },
            fetcher: fetch,
            baseURL: locals.baseURL,
            options: {
                headers: {
                    Authorization: cookies.get(COOKIE_KEYS.SESSION_KEY) || ''
                }
            }
        })
        if (!createPharmacistResponse.ok) {
            error(createPharmacistResponse.status, {
                message: createPharmacistResponse.message,
                status: createPharmacistResponse.status
            })
        }
        redirect(302, '/app/pharmacists')
    }
} satisfies Actions