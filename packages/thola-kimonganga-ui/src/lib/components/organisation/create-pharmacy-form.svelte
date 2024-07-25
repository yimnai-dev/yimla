<script lang="ts">
	import { COUNTRY_STATES_MAP } from '$lib/constants';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from '../../../routes/tko/pharmacies/new/$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createPharmacySchema } from '$lib/forms/pharmacy.form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import MapBox from '../shared/map-box.svelte';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { ToastState } from '../toast/toast-state.svelte';
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pharmacyListOptions } from '$lib/query/pharmacy.query';
	import type { Pharmacy, PharmacyListResponse } from '$lib/types/thola-kimonganga.types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	const countryList = $state.frozen(['Cameroon']);

	let creatingPharmacy = $state(false);

	let form = superForm(data.createPharmacyForm, {
		validators: zodClient(createPharmacySchema),
		resetForm: true,
		onSubmit: () => {
			creatingPharmacy = true;
			toastState.addToast({
				type: 'info',
				message: 'Pharmacy creation in background...',
				duration: 5
			});
			$page.data.queryClient.setQueryData<PharmacyListResponse>(
				pharmacyListOptions($page.data.pharmacyListStream).queryKey,
				(old) => {
					if (!old || !old.ok) return;
					const pharma: Pharmacy = {
						...$formData,
						geoLocation: `POINT(${$formData.longitude} ${$formData.latitude})`,
						organisationId: $page.data.orgInfo.organisationId,
						pharmacyId: crypto.randomUUID(),
						createdOn: new Date().toString(),
						updatedOn: new Date().toString(),
						isActive: false
					};
					return {
						...old,
						pharmacies: [
							...old.pharmacies,
							pharma
						]
					};
				}
			);
			goto(`/tko`);
		},
		onError: ({ result }) => {
			creatingPharmacy = false;
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message,
					title: 'Pharmacy Creation Failed',
					duration: 3000
				});
				$page.data.queryClient.setQueryData<PharmacyListResponse>(
					pharmacyListOptions($page.data.pharmacyListStream).queryKey,
					(old) => {
						if (!old || !old.ok) return;
						return {
							...old,
							pharmacies: old.pharmacies?.slice(0, old.pharmacies.length - 1)
						};
					}
				);
			}
		},
		onResult: ({ result }) => {
			creatingPharmacy = false;
			if (result.type === 'success') {
				toastState.addToast({
					type: 'success',
					message: result.data?.message,
					title: 'Operation Successful',
					duration: 3000
				});
				return;
			}
			$page.data.queryClient.setQueryData<PharmacyListResponse>(
				pharmacyListOptions($page.data.pharmacyListStream).queryKey,
				(old) => {
					if (!old || !old.ok) return;
					return {
						...old,
						pharmacies: old.pharmacies?.slice(0, old.pharmacies.length - 1)
					};
				}
			);
		}
	});

	let { form: formData, enhance } = $state(form);

	onMount(() => {
		if ($page.data.orgInfo) {
			formData.update(($prev) => {
				return { ...$prev, organisationId: $page.data.orgInfo.organisationId };
			});
		}
	});
</script>

<h1 class="text-xl md:text-2xl lg:text-3xl">Create A New Pharmacy</h1>
<form method="POST" class="grid gap-4 py-4" use:enhance>
	<Form.FormField {form} name="name" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Pharmacy Name</Form.Label>
			<Input {...attrs} placeholder="pharma1" bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="country" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Pharmacy Country</Form.Label>
			<Select.Root
				{...attrs}
				onSelectedChange={(v) => {
				if(!v) return
				formData.update(($prev) => {
					return { ...$prev, country: v.value as string };
				})
			}}
			>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select Country" />
				</Select.Trigger>
				<Select.Content>
					{#each countryList as country (country)}
						<Select.Item value={country}>{country}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<Input hidden bind:value={$formData.country} name={attrs.name} class="hidden" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="organisationId" class="hidden gap-2">
		<Form.Control let:attrs>
			<Input hidden class="hidden" bind:value={$formData.organisationId} name={attrs.name} />
		</Form.Control>
	</Form.FormField>
	<Form.FormField {form} name="latitude" class="hidden gap-2">
		<Form.Control let:attrs>
			<Input hidden class="hidden" bind:value={$formData.latitude} name={attrs.name} />
		</Form.Control>
	</Form.FormField>
	<Form.FormField {form} name="longitude" class="hidden gap-2">
		<Form.Control let:attrs>
			<Input hidden class="hidden" bind:value={$formData.longitude} name={attrs.name} />
		</Form.Control>
	</Form.FormField>

	<Form.FormField {form} name="region" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Pharmacy State</Form.Label>
			<Select.Root
				{...attrs}
				onSelectedChange={(v) => {
				if (!v) return;
				formData.update(($prev) => {
					return { ...$prev, region: v.value as string };
				});
			}}
			>
				<Select.Trigger class="w-full" bind:value={$formData.region}>
					<Select.Value placeholder="Select State" />
				</Select.Trigger>
				<Select.Content>
					{@const states = COUNTRY_STATES_MAP[$formData.country] || COUNTRY_STATES_MAP['Cameroon']}
					{#if !states.length}
						<Select.Item value="N/A">N/A</Select.Item>
					{:else}
						{#each states as state (state)}
							<Select.Item value={state}>{state}</Select.Item>
						{/each}
					{/if}
				</Select.Content>
			</Select.Root>
			<Input hidden bind:value={$formData.region} name={attrs.name} class="hidden" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="city" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>City</Form.Label>
			<Input {...attrs} placeholder="Buea" bind:value={$formData.city} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	<Form.FormField {form} name="address" class="grid gap-2">
		<Form.Control let:attrs>
			<Form.Label>Pharmacy Address</Form.Label>
			<Input {...attrs} placeholder="Molyko" bind:value={$formData.address} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.FormField>
	{#if data.mapBoxApiKey}
		<MapBox
			bind:latitude={$formData.latitude}
			bind:longitude={$formData.longitude}
			accessToken={data.mapBoxApiKey}
		/>
	{/if}
	<div class="container flex w-full items-center justify-center py-2">
		<Form.Button type="submit" class="md:w-[200px]">
			{#if creatingPharmacy}
				<Spinner />
			{/if}
			{creatingPharmacy ? 'Creating...' : 'Create'}
		</Form.Button>
	</div>
</form>
