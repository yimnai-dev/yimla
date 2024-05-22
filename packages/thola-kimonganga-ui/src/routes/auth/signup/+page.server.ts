import { signupSchema, verifyEmailSchema } from '$lib/forms/auth/auth.form';
import { error, redirect, type Actions } from '@sveltejs/kit'
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import ky from "ky";
import type { CreateUserAccountResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { ROLES } from '$lib/roles';

export const load = async ({ locals, cookies }) => {
    const signupEmail = cookies.get(COOKIE_KEYS.SIGNUP_EMAIL);
    if (!signupEmail) {
        redirect(302, '/auth/verify-email')
    }
    verifyEmailSchema.parseAsync({ email: signupEmail }).catch(() => {
        redirect(302, '/auth/verify-email')
    })
    if (locals.tholaApp !== 'thola-client') {
        redirect(302, '/');
    }
    const signupForm = await superValidate(zod(signupSchema));

    return {
        signupForm,
        signupEmail
    }
}

export const actions = {
    default: async ({ request, locals, cookies }) => {
        const signupEmail = cookies.get(COOKIE_KEYS.SIGNUP_EMAIL) as string;
        const baseURL = locals.baseURL;
        const signupForm = await superValidate(request, zod(signupSchema));
        if (!signupForm.valid) {
            fail(400, {
                signupForm
            })
        }
        const signupRes = await ky.post(`${baseURL}/create`, {
            json: {
                firstName: signupForm.data.firstName,
                lastName: signupForm.data.lastName,
                username: signupForm.data.username,
                password: signupForm.data.password,
                email: signupEmail,
                confirmationCode: signupForm.data.confirmationCode,
                role: ROLES.USER

            }
        }).json<CreateUserAccountResponse>();
        cookies.delete(COOKIE_KEYS.SIGNUP_EMAIL, {
            path: '/',
        });
        if (!signupRes.ok) {
            error(signupRes.status, {
                message: signupRes.message,
                status: signupRes.status
            })
        }

        redirect(302, '/auth/login');
    }
} satisfies Actions