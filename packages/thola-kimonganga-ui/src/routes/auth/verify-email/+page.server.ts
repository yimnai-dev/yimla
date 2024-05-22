import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import ky from "ky";
import { error } from '@sveltejs/kit';
import type { VerifyEmailResponse } from "$lib";
import { COOKIE_KEYS } from "$lib/cookie-keys";
import { verifyEmailSchema } from "$lib/forms/auth/auth.form";
import type { PageServerLoad } from "./$types";

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
    default: async ({ request, locals, cookies }) => {
        const baseURL = locals.baseURL;
        const userRole = locals.userRole;
        const verifyEmailForm = await superValidate(request, zod(verifyEmailSchema));
        if (!verifyEmailForm.valid) {
            fail(400, {
                verifyEmailForm,
            })
        }
        const verifyEmailRes = await ky.post(`${baseURL}/email-verification`, { json: { email: verifyEmailForm.data.email, role: userRole } }).json<VerifyEmailResponse>()
        console.log('verificaitonRes: ', verifyEmailRes)
        if(!verifyEmailRes) {
            error(500, {
                message: 'Sorry an unknown error occured. Please try again!',
                status: 500
            })
        }
        if (!verifyEmailRes.ok) {
            error(verifyEmailRes.status, {
                message: verifyEmailRes.message,
                status: verifyEmailRes.status
            })
        }
        cookies.set(COOKIE_KEYS.SIGNUP_EMAIL, verifyEmailForm.data.email, {
            path: '/',
        })
        const redirectURL = '/auth/signup'
        redirect(302, redirectURL);
    }
} satisfies Actions