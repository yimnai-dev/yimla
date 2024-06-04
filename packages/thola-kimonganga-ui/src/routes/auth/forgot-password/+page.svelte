<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import type { ToastState } from '$lib/components/toast/toast-state.svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys.js';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { forgotPasswordSchema } from '$lib/forms/auth/auth.form';

	let { data } = $props();

	const toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let sendingResetEmail = $state(false);

	const form = superForm(data.forgotPasswordForm, {
		validators: zodClient(forgotPasswordSchema),
		onSubmit: () => {
			sendingResetEmail = true;
		},
		onError: ({ result }) => {
			sendingResetEmail = false;
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
			sendingResetEmail = false;
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
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message,
					title: 'Login failed'
				});
				return;
			}
			if (result.type === 'redirect') {
				toastState.addToast({
					type: 'success',
					message: 'Login successful',
					title: 'Login successful'
				});
				goto(result.location);
			}
		}
	});

	let { form: formData, enhance } = form;

	let emailPlaceholder = $derived.by(() => {
		if ($page.data.tholaApp === 'thola-client') {
			return 'johnddoe@gmail.com';
		}
		if ($page.data.tholaApp === 'thola-org') {
			return 'pharma-org@thola.com';
		}
		return 'pharmacy.myorg@thola.com';
	});
</script>

<Card.Root
	class="mx-auto max-md:flex max-md:h-full max-md:w-full max-md:flex-col max-md:justify-center"
>
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="grid gap-4" method="POST" use:enhance>
			<Form.FormField {form} name="email" class="grid gap-2">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} placeholder={emailPlaceholder} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description>This is your login email.</Form.Description>
				<Form.FieldErrors />
			</Form.FormField>
			<Button type="submit" class="w-full">
				{#if sendingResetEmail}
					<Spinner />
				{/if}
				{sendingResetEmail ? 'Sending Recovery Email...' : 'Send Password Recovery Email'}
			</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="login" class="underline">Login Instead</a>
		</div>
	</Card.Content>
</Card.Root>
