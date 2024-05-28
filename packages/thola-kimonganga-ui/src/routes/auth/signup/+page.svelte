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
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { signupSchema } from '$lib/forms/auth/auth.form';

	let { data } = $props();

	const toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let signingUp = $state(false);

	const form = superForm(data.signupForm, {
		validators: zodClient(signupSchema),
		onSubmit: () => {
			signingUp = true;
		},
		onError: ({ result }) => {
			signingUp = false;
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message,
					title: 'Operation failed'
				});
				return;
			}
		},
		onResult: ({ result }) => {
			signingUp = false;
            if(result.type === 'failure') {
                for(const key in result.data?.form.errors) {
                    toastState.addToast({
                        type: 'error',
                        message: result.data?.form.errors[key][0]
                    })
                }
                return;
            }
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message,
					title: 'Account creation failed'
				});
				return;
			}
			if (result.type === 'redirect') {
				toastState.addToast({
					type: 'success',
					message: 'Account created successfully',
					title: 'Operation successful'
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
	class="mx-auto max-md:flex max-md:min-h-full max-md:w-full max-md:flex-col max-md:justify-center"
>
	<Card.Header>
		<Card.Title class="text-2xl">Sign Up</Card.Title>
		<Card.Description>Create your <strong>Thola Kimonganga </strong> Account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="grid gap-4" method="POST" use:enhance>
            <h1 class="font-bold">Signup Email</h1>
			<p class="w-full border-2 border-secondary rounded-md p-2 cursor-not-allowed">{data.signupEmail}</p>
			<div class="flex w-full flex-col gap-2 py-2 md:flex-row">
				<Form.FormField {form} name="firstName" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>First Name</Form.Label>
						<Input {...attrs} type="text" placeholder="John" bind:value={$formData.firstName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.FormField {form} name="lastName" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Last Name</Form.Label>
						<Input {...attrs} type="text" placeholder="Doe" bind:value={$formData.lastName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
			</div>
			<div class="flex w-full flex-col gap-2 py-2 md:flex-row">
				<Form.FormField {form} name="username" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>
						<Input {...attrs} type="text" placeholder="john-doe" bind:value={$formData.username} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.FormField {form} name="password" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input
							{...attrs}
							type="password"
							placeholder="password123"
							bind:value={$formData.password}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
			</div>
			<div class="flex w-full flex-col gap-2 py-2 md:flex-row">
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
			</div>
			<Button type="submit" class="w-full">
				{#if signingUp}
					<Spinner />
				{/if}
				{signingUp ? 'Creating account...' : 'Sign Up'}
			</Button>
		</form>
		{#if $page.data.tholaApp === 'thola-client'}
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="signup" class="underline">Login Instead</a>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
