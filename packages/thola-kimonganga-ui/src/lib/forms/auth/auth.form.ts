import { z } from 'zod';

export const verifyEmailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Invalid email address' })
});

export const forgotPasswordSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Invalid email address' })
});

export const resetPasswordSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Invalid email address' }),
		newPassword: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmationCode: z.string({ required_error: 'Reset confirmation code is required' }).length(6)
	})
	.superRefine((fields, ctx) => {
		if (fields.newPassword !== fields.confirmPassword) {
			ctx.addIssue({
				path: ['confirmPassword'],
				code: 'custom',
				message: 'Passwords do not match'
			});
		}
	});

export const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Invalid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
});

export const signupSchema = z
	.object({
		firstName: z.string({ required_error: 'First name is required' }),
		lastName: z.string({ required_error: 'Last name is required' }),
		username: z
			.string({ required_error: 'Username is required' })
			.min(3, { message: 'Username must be at least 3 characters' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string({ required_error: 'Confirm password is required' }),
		confirmationCode: z
			.string({ required_error: 'Confirmation code is required' })
			.regex(/^[0-9]{6}$/)
	})
	.superRefine((fields, ctx) => {
		if (fields.password !== fields.confirmPassword) {
			ctx.addIssue({
				path: ['confirmPassword'],
				code: 'custom',
				message: 'Passwords do not match'
			});
		}
		if (fields.username.includes(' ')) {
			ctx.addIssue({
				path: ['username'],
				code: 'custom',
				message: 'Username cannot contain spaces'
			});
		}
		const specialChars = /[^a-zA-Z0-9_-]/g;
		if (fields.username.match(specialChars)) {
			ctx.addIssue({
				path: ['username'],
				code: 'custom',
				message: 'Username cannot contain special characters'
			});
		}
	});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;

export type CreateUserAccountSchema = z.infer<typeof signupSchema>;

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
