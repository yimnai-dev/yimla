import { COOKIE_KEYS } from '$lib/cookie-keys';
import { forgotPasswordSchema, resetPasswordSchema } from '$lib/forms/auth/auth.form';
import { redirect, type Actions, error, isHttpError } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import ky from 'ky';
import type { ResetPasswordResponse } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
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
	default: async ({ request, locals, cookies }) => {
		const baseURL = locals.baseURL;
		const userRole = locals.userRole;
		const email = cookies.get(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL);
		const resetPasswordForm = await superValidate(request, zod(resetPasswordSchema));
		if (!resetPasswordForm.valid) {
			fail(400, {
				resetPasswordForm
			});
		}
		await ky
			.put(`${baseURL}/reset-password`, {
				json: {
					email: resetPasswordForm.data.email || email,
					password: resetPasswordForm.data.newPassword,
					confirmationCode: resetPasswordForm.data.confirmationCode,
					role: userRole,
				}
			})
			.json<ResetPasswordResponse>().then(response => {
				if (!response.ok) {
					error(response.status, {
						message: response.message,
						status: response.status
					});
				}
				cookies.delete(COOKIE_KEYS.FORGOT_PASSWORD_EMAIL, {
					path: '/'
				});
				console.log('yeam man')
				redirect(302, '/auth/login');
			}).catch((e) => {
				if (e instanceof Error) {
					error(500, {
						message: e.message,
						status: 500
					})
				}
				if (isHttpError(e)) {
					error(e.status, {
						message: e.body.message,
						status: e.status
					})
				}
				error(500, {
					message: 'Sorry an unknown error occured. Please try again!',
					status: 500
				})
			})
	}
} satisfies Actions;
