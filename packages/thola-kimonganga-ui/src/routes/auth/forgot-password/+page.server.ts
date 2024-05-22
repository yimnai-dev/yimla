import { forgotPasswordSchema } from '$lib/forms/auth/auth.form';
import { type Actions, error, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import ky from 'ky';
import { type VerifyEmailResponse } from '$lib';

export const load = async () => {
	const forgotPasswordForm = await superValidate(zod(forgotPasswordSchema));
	return {
		forgotPasswordForm
	};
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const baseURL = locals.baseURL;
		const userRole = locals.userRole;
		const forgotPasswordForm = await superValidate(request, zod(forgotPasswordSchema));
		if (!forgotPasswordForm.valid) {
			fail(400, {
				forgotPasswordForm
			});
		}
		const forgotPasswordRes = await ky
			.post(`${baseURL}/forgot-password`, {
				json: { email: forgotPasswordForm.data.email, role: userRole }
			})
			.json<VerifyEmailResponse>();
		if (!forgotPasswordRes) {
			error(500, {
				message: 'Sorry an unknown error occured. Please try again!',
				status: 500
			});
		}
		if (!forgotPasswordRes.ok) {
			error(forgotPasswordRes.status, {
				message: forgotPasswordRes.message,
				status: forgotPasswordRes.status
			});
		}
		cookies.set(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL, forgotPasswordForm.data.email, {
			path: '/'
		});
		const redirectURL = '/auth/reset-password';
		redirect(302, redirectURL);
	}
} satisfies Actions;
