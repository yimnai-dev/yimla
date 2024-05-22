<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { resetPasswordSchema } from '$lib/forms/auth/auth.form.js';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys.js';
	import type { ToastState } from '$lib/components/toast/toast-state.svelte.js';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import { page } from '$app/stores';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();

	const toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let resettingPassword = $state(false);

	let form = superForm(data.resetPasswordForm, {
		validators: zodClient(resetPasswordSchema),
		resetForm: true,
		onSubmit: () => {
			toastState.addToast({
				type: 'info',
				message: 'Password reset in progress...',
				duration: 5
			});
			resettingPassword = true;
		},
		onError: ({ result }) => {
			resettingPassword = false;
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message,
					title: 'Login failed'
				});
				return;
			}
		},
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({
						type: 'error',
						message: errors[key][0]
					});
				}
				return;
			}
			if (result.type === 'redirect') {
				goto(result.location);
			}
		}
	});

	let { form: formData, enhance, errors } = form;

	onMount(() => {
		$formData.email = data.forgotPasswordEmail
	})
</script>

<Card.Root
	class="mx-auto max-md:flex max-md:min-h-full max-md:w-full max-md:flex-col max-md:justify-center"
>
	<Card.Header>
		<Card.Title class="text-2xl">Reset Password</Card.Title>
		<Card.Description>Reset your <strong>Thola Kimonganga </strong> Password</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="grid gap-4" method="POST" use:enhance>
			<h1 class="font-bold">Your Email</h1>
			<p class="w-full cursor-not-allowed rounded-md border-2 border-secondary p-2">
				{data.forgotPasswordEmail}
			</p>
			<Form.FormField {form} name="newPassword" class="grid gap-2">
				<Form.Control let:attrs>
					<Form.Label>New Password</Form.Label>
					<Input
						{...attrs}
						type="password"
						placeholder="password"
						bind:value={$formData.newPassword}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.FormField>
			<Form.FormField {form} name="confirmPassword" class="grid gap-2">
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input
						{...attrs}
						type="password"
						placeholder="password"
						bind:value={$formData.confirmPassword}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.FormField>
			<Form.FormField {form} name="confirmationCode" class="grid gap-2">
				<Form.Control let:attrs>
					<Form.Label>Confirmation Code</Form.Label>
					<Input
						{...attrs}
						type="text"
						placeholder="123456"
						bind:value={$formData.confirmationCode}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.FormField>

			<Button type="submit" class="w-full" disabled={Object.keys($errors).length > 0}>
				{#if resettingPassword}
					<Spinner />
				{/if}
				{resettingPassword ? 'Changing Password...' : 'Reset Password'}
			</Button>
		</form>
		{#if $page.data.tholaApp === 'thola-client'}
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="login" class="underline">Login Instead</a>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
