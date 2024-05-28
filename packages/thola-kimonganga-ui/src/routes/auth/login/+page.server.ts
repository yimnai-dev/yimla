import { loginSchema } from "$lib/forms/auth/auth.form";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import { error } from '@sveltejs/kit';
import type { LoginParameters, LoginResponse } from "$lib";
import { COOKIE_KEYS } from "$lib/cookie-keys";
import { post } from "$lib/urls";

export const load = async () => {
    const loginForm = await superValidate(zod(loginSchema));
    return {
        loginForm
    }
}

export const actions = {
    login: async ({ request, locals, url, cookies, fetch }) => {
        const baseURL = locals.baseURL;
        const loginForm = await superValidate(request, zod(loginSchema));
        if (!loginForm.valid) {
            fail(400, {
                loginForm
            })
        }
        const loginUser = await post<LoginResponse, LoginParameters>({
            url: 'login',
            input: {
                email: loginForm.data.email,
                password: loginForm.data.password,
                role: locals.userRole,
            },
            fetcher: fetch,
            baseURL
        })
        if (!loginUser.ok) {
            error(loginUser.status, {
                message: loginUser.message,
                status: loginUser.status
            })
        }
        cookies.set(COOKIE_KEYS.SESSION_KEY, loginUser.sessionKey, {
            path: '/',
        })
        const redirectURL = url.searchParams.has('redirectTo') ? url.searchParams.get('redirectTo') as string : '/app';
        redirect(302, redirectURL);
    },
    logout: async ({ cookies }) => {
        cookies.delete(COOKIE_KEYS.SESSION_KEY, {
            path: '/',
        })
        redirect(302, '/auth/login')
    }
} satisfies Actions