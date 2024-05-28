import { forgotPasswordSchema } from '$lib/forms/auth/auth.form';
import { type Actions, error, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { type VerifyEmailParameters, type VerifyEmailResponse } from '$lib';
import { post } from '$lib/urls';

export const load = async () => {
	const forgotPasswordForm = await superValidate(zod(forgotPasswordSchema));
	return {
		forgotPasswordForm
	};
};

export const actions = {
	default: async ({ request, locals, cookies, fetch }) => {
		const baseURL = locals.baseURL;
		const userRole = locals.userRole;
		const forgotPasswordForm = await superValidate(request, zod(forgotPasswordSchema));
		if (!forgotPasswordForm.valid) {
			fail(400, {
				forgotPasswordForm
			});
		}
		const forgotPasswordResponse = await post<VerifyEmailResponse, VerifyEmailParameters>({
			url: 'forgot-password',
			input: {
				email: forgotPasswordForm.data.email,
				role: userRole
			},
			fetcher: fetch,
			baseURL
		})
		if (!forgotPasswordResponse.ok) {
			error(forgotPasswordResponse.status, {
				message: forgotPasswordResponse.message,
				status: forgotPasswordResponse.status
			});
		}
		cookies.set(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL, forgotPasswordForm.data.email, {
			path: '/'
		});
		const redirectURL = '/auth/reset-password';
		redirect(302, redirectURL);
	}
} satisfies Actions;
