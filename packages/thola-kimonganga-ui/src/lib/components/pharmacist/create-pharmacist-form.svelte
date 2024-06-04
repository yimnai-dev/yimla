<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../../routes/app/pharmacists/new/$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { ToastState } from '../toast/toast-state.svelte';
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { createPharmacistSchema } from '$lib/forms/pharmacist.form';
	import { pharmacyListOptions } from '$lib/query/pharmacy.query';
	import { createQuery } from '@tanstack/svelte-query';
	import type { PharmacyListResponse } from '$lib/types/thola-kimonganga.types';
	import { SquareActivity } from 'lucide-svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let creatingPharmacist = $state(false);

	let form = superForm(data.createPharmacistForm, {
		validators: zodClient(createPharmacistSchema),
		resetForm: true,
		onSubmit: () => {
			creatingPharmacist = true;
		},
		onError: ({ result }) => {
			creatingPharmacist = false;
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message,
					title: 'Pharmacist Creation Failed',
					duration: 3000
				});
			}
		},
		onResult: ({ result }) => {
			creatingPharmacist = false;
			if (result.type === 'redirect') {
				toastState.addToast({
					type: 'success',
					message: 'Pharmacist created successfully',
					title: 'Operation Successful',
					duration: 3000
				});
				goto(result.location);
			}
			if (result.type === 'success') {
				toastState.addToast({
					type: 'success',
					message: result.data?.message,
					title: 'Operation Successful',
					duration: 3000
				});
				goto('/app/pharmacists');
				return;
			}
		}
	});

	let pharmacyListStream = getContext<Promise<PharmacyListResponse>>(
		CONTEXT_KEYS.PHARMACY_LIST_STREAM
	);

	let { form: formData, enhance } = $state(form);

	let pharmacyListQuery = createQuery(pharmacyListOptions(pharmacyListStream));
</script>

<h1 class="text-xl md:text-2xl lg:text-3xl">Create A New Pharmacist</h1>
<form method="POST" class="grid gap-4 py-4" use:enhance>
	<Form.FormField {form} name="firstName" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>First Name</Form.Label>
			<Input {...attrs} placeholder="John" bind:value={$formData.firstName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="lastName" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Last Name</Form.Label>
			<Input {...attrs} placeholder="Doe" bind:value={$formData.lastName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="username" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input {...attrs} placeholder="Doe" bind:value={$formData.username} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="email" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} type="email" placeholder="johndoe@email.com" bind:value={$formData.email} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>

	<Form.FormField {form} name="phoneNumber" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Phone Number</Form.Label>
			<Input {...attrs} placeholder="1234567890" bind:value={$formData.phoneNumber} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="pharmacyId" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Select Pharmacy</Form.Label>
			<Select.Root
				{...attrs}
				onSelectedChange={(v) => {
				if(!v) return
				formData.update(($prev) => {
					return { ...$prev, pharmacyId: v.value as string };
				})
			}}
			>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select Pharmacy" />
				</Select.Trigger>
				{#if $pharmacyListQuery.data && $pharmacyListQuery.data.ok}
					{@const pharmacies = $pharmacyListQuery.data.pharmacies}
					<Select.Content>
						{#each pharmacies as pharmacy (pharmacy.pharmacyId)}
							<Select.Item value={pharmacy.pharmacyId}>
								<SquareActivity /> &nbsp;
								{pharmacy.name}
							</Select.Item>
						{/each}
					</Select.Content>
				{/if}
			</Select.Root>
			<Input hidden bind:value={$formData.pharmacyId} name={attrs.name} class="hidden" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<div class="container flex w-full items-center justify-center py-2">
		<Form.Button type="submit" class="md:w-[200px]">
			{#if creatingPharmacist}
				<Spinner />
			{/if}
			{creatingPharmacist ? 'Creating...' : 'Create'}
		</Form.Button>
	</div>
</form>
