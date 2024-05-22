import { loginSchema } from "$lib/forms/auth/auth.form";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import ky from "ky";
import { error } from '@sveltejs/kit';
import type { LoginResponse } from "$lib";
import { COOKIE_KEYS } from "$lib/cookie-keys";

export const load = async () => {
    const loginForm = await superValidate(zod(loginSchema));
    return {
        loginForm
    }
}

export const actions = {
    default: async ({ request, locals, url, cookies }) => {
        const baseURL = locals.baseURL;
        const loginForm = await superValidate(request, zod(loginSchema));
        if (!loginForm.valid) {
            fail(400, {
                loginForm
            })
        }
        const loginRes = await ky.post(`${baseURL}/login`, {
            json: {
                email: loginForm.data.email,
                password: loginForm.data.password,
                role: locals.userRole
            },
        }).json<LoginResponse>();
        if (!loginRes.ok) {
            error(loginRes.status, {
                message: loginRes.message,
                status: loginRes.status
            })
        }
        cookies.set(COOKIE_KEYS.SESSION_KEY, loginRes.sessionKey, {
            path: '/',
        })
        const redirectURL = url.searchParams.get('redirectTo') || '/dashboard';
        redirect(302, redirectURL);
    }
} satisfies Actions