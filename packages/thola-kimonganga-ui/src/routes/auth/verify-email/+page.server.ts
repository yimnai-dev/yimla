import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import { error } from '@sveltejs/kit';
import type { VerifyEmailParameters, VerifyEmailResponse } from "$lib";
import { COOKIE_KEYS } from "$lib/cookie-keys";
import { verifyEmailSchema } from "$lib/forms/auth/auth.form";
import type { PageServerLoad } from "./$types";
import { post } from "$lib/urls";

export const load: PageServerLoad = async ({ locals }) => {
    const verifyEmailForm = await superValidate(zod(verifyEmailSchema));
    if (locals.tholaApp !== 'thola-client') {
        redirect(302, '/auth/login');
    }
    return {
        verifyEmailForm
    }
}

export const actions = {
    default: async ({ request, locals, cookies, fetch }) => {
        const baseURL = locals.baseURL;
        const userRole = locals.userRole;
        const verifyEmailForm = await superValidate(request, zod(verifyEmailSchema));
        if (!verifyEmailForm.valid) {
            fail(400, {
                verifyEmailForm,
            })
        }
        const verifyEmailResponse = await post<VerifyEmailResponse, VerifyEmailParameters>({
            url: 'email-verification',
            input: {
                email: verifyEmailForm.data.email,
                role: userRole
            },
            fetcher: fetch,
            baseURL
        })
        if (!verifyEmailResponse.ok) {
            error(verifyEmailResponse.status, {
                message: verifyEmailResponse.message,
                status: verifyEmailResponse.status
            })
        }
        cookies.set(COOKIE_KEYS.SIGNUP_EMAIL, verifyEmailForm.data.email, {
            path: '/',
        })
        const redirectURL = '/auth/signup'
        redirect(302, redirectURL);
    }
} satisfies Actions