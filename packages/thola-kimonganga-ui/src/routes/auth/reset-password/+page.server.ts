import { COOKIE_KEYS } from '$lib/cookie-keys';
import { forgotPasswordSchema, resetPasswordSchema } from '$lib/forms/auth/auth.form';
import { redirect, type Actions, error } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ResetPasswordParameters, ResetPasswordResponse } from '$lib';
import { post } from '$lib/urls';

export const load = async ({ cookies }) => {
	const forgotPasswordEmail = cookies.get(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL);
	if (!forgotPasswordEmail) {
		redirect(302, `/auth/forgot-password`);
	}
	forgotPasswordSchema.parseAsync({ email: forgotPasswordEmail }).catch(() => {
		redirect(302, '/auth/forgot-password');
	});

	const resetPasswordForm = await superValidate(zod(resetPasswordSchema));
	return {
		resetPasswordForm,
		forgotPasswordEmail
	};
};

export const actions = {
	default: async ({ request, locals, cookies, fetch }) => {
		const baseURL = locals.baseURL;
		const userRole = locals.userRole;
		const email = cookies.get(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL);
		if (!email) {
			redirect(302, '/auth/forgot-password');
		}
		const resetPasswordForm = await superValidate(request, zod(resetPasswordSchema));
		if (!resetPasswordForm.valid) {
			fail(400, {
				resetPasswordForm
			});
		}
		const resetPasswordResponse = await post<ResetPasswordResponse, ResetPasswordParameters>({
			url: 'reset-password',
			input: {
				email: resetPasswordForm.data.email || email,
				password: resetPasswordForm.data.newPassword,
				confirmationCode: resetPasswordForm.data.confirmationCode,
				role: userRole,
			},
			fetcher: fetch,
			baseURL
		})
		if (!resetPasswordResponse.ok) {
			error(resetPasswordResponse.status, {
				message: resetPasswordResponse.message,
				status: resetPasswordResponse.status
			});
		}
		cookies.delete(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL, {
			path: '/'
		});
		redirect(302, '/auth/login');
	}
} satisfies Actions;
