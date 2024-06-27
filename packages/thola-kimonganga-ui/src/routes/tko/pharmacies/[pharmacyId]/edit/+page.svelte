<script lang="ts">
	import Spinner from '$lib/components/spinner/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import type { PharmacyListResponse } from '$lib';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { pharmacyListOptions } from '$lib/query/pharmacy.query';
	import { LucideRabbit } from 'lucide-svelte';
    import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updatePharmacySchema, type UpdatePharmacySchema } from '$lib/forms/pharmacy.form';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { ToastState } from '$lib/components/toast/toast-state.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { createQuery } from '@tanstack/svelte-query';
	import { subscriptionListOptions } from '$lib/query/subscription.query';
	import dayjs from 'dayjs';

    type Props = {
        data: PageData
    }

	let { data }: Props = $props();

	let pharmacyListResponse = $state(
		$page.data.queryClient.getQueryData<PharmacyListResponse>(
			pharmacyListOptions(data.pharmacyListStream).queryKey
		)
	);

	let pharmacy = $derived.by(() => {
		if (!pharmacyListResponse || !pharmacyListResponse.ok) return;
		return pharmacyListResponse.pharmacies.find((p) => p.pharmacyId === $page.params.pharmacyId);
	});

	const from = $navigating?.from?.url?.pathname;

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST)

	let updatingPharmacy = $state(false)

	function goBack() {
		if (!from) {
			goto('/tko/pharmacies');
			return;
		}
		goto(from);
	}

	function revokePharmacyListChange() {
		$page.data.queryClient.setQueryData<PharmacyListResponse>(pharmacyListOptions(data.pharmacyListStream).queryKey, (old) => {
			if(!old || !old.ok || !pharmacy) return;
			return {
				...old,
				pharmacies: old.pharmacies.map(p => {
					if(p.pharmacyId === $page.params.pharmacyId) {
						return {
							...p,
							isActive: pharmacy.isActive,
							name: pharmacy.name
						}
					}
				})
			}
		})
	}

    const form = superForm(data.updatePharmacyForm, {
        id: `update_pharmacy_form_${$page.params.pharmacyId}`,
		validators: zodClient(updatePharmacySchema),
		onSubmit: ({ formData }) => {
			updatingPharmacy = true;
			toastState.addToast({
				type: 'info',
				message: 'Pharmacy Update in progress...'
			})
			$page.data.queryClient.setQueryData<PharmacyListResponse>(pharmacyListOptions(data.pharmacyListStream).queryKey, (old) => {
				if(!old || !old.ok) return;
				let pharmacy = old.pharmacies.find((p) => p.pharmacyId === $page.params.pharmacyId);
				if(!pharmacy) return;
				const formEntries = Object.fromEntries(formData.entries()) as UpdatePharmacySchema;
				pharmacy = {
					...pharmacy,
					isActive: formEntries.isActive || pharmacy.isActive,
					name: formEntries.name || pharmacy.name
				}
				const pharmacyList = old.pharmacies.map((p) => {
					if (p.pharmacyId === $page.params.pharmacyId) {
						return pharmacy
					}
					return p
				})
				return {
					...old,
					pharmacies: pharmacyList
				}
			})
			goBack()
		},
		onError: ({ result }) => {
			updatingPharmacy = false;
			toastState.addToast({
				type: 'error',
				message: result.error.message,
			})
			revokePharmacyListChange()
			goBack()
		},
		onResult: ({ result }) => {
			updatingPharmacy = false;
			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({
						type: 'error',
						message: errors[key][0]
					});
				}
				revokePharmacyListChange()
				goBack()
				return;
			}
			toastState.addToast({
				type: 'success',
				message: 'Pharmacy updated successfully'
			})
		}
    })

	let {form: formData, enhance, isTainted, tainted} = form;

	let subscriptionListQuery = createQuery(subscriptionListOptions(data.subscriptionListStream))

	let seatsExhausted = $state(false)

	subscriptionListQuery.subscribe(($query) => {
		if(!pharmacyListResponse || !pharmacyListResponse.ok) return;
		if(!$query.data || !$query.data.ok) return;
		const activeSubscriptions = $query.data.subscriptionList.filter((sub) => sub.status === 'active').sort((sub1, sub2) => dayjs(sub1.current_period_end).unix() - dayjs(sub2.current_period_end).unix())
		if(!activeSubscriptions.length) return;
		const currentSubscription = activeSubscriptions[0];
		const items = currentSubscription.items.data;
		if(!items.length) return;
		const currentSub = items[0]
		if(!currentSub.quantity) return;
		const activePharmacySize = pharmacyListResponse.pharmacies.map(p => p.isActive).length
		seatsExhausted = activePharmacySize > currentSub.quantity
	})

	onMount(() => {
		if(pharmacy) {
			$formData.name = pharmacy.name
			$formData.isActive = pharmacy.isActive
		}
	})
</script>

<Sheet.Root open onOpenChange={goBack}>
	<Sheet.Content side="right" class="overflow-y-scroll">
		{#if !pharmacy}
			<div class="flex h-full w-full flex-col items-center justify-center space-y-10">
				<LucideRabbit size={150} />
				<h1 class="text-center text-2xl font-bold">
					Pharmacy you are trying to update does not exist
				</h1>
				<p class="text-center">Try with a different pharmacy</p>
				<Button variant="outline" href="/tko/pharmacies">View Other Pharmacies</Button>
			</div>
		{:else}
			<Sheet.Header>
				<Sheet.Title>Update pharmacy</Sheet.Title>
				<Sheet.Description>
					Make changes to <strong>{pharmacy.name}</strong> here. Click save when you're done.
				</Sheet.Description>
			</Sheet.Header>
			<form class="pt-5" action="/tko/pharmacies/?/update" method="POST" use:enhance>
				<Form.FormField {form} name="name" class="grid gap-2">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs}  bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.FormField>
				<Form.Field {form} name="isActive" class="w-full">
					<Form.Control let:attrs>
						<Form.Label>Active Status</Form.Label>
						<Select.Root
							{...attrs}
							disabled={seatsExhausted && pharmacy?.isActive}
							onSelectedChange={(v) => {
							if(!v) return
							formData.update(($prev) => {
								return { ...$prev, isActive: v.value as boolean };
							})
						}}
						>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Set active status" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={true}>
									Add To Subscription
								</Select.Item>
								<Select.Item value={false}>
									Remove From Subscription
								</Select.Item>
							</Select.Content>
						</Select.Root>
						<Input hidden name={attrs.name} class="hidden" bind:value={$formData.isActive} />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button disabled={$formData?.name?.toLowerCase() === pharmacy?.name?.toLowerCase() && $formData?.isActive === pharmacy?.isActive} type="submit" variant="outline" class="w-full mt-3 bg-primary">
					{#if updatingPharmacy}
						<Spinner />
						Updating...
						{:else}
						Save Changes
					{/if}
				</Form.Button>
			</form>
		{/if}
	</Sheet.Content>
</Sheet.Root>
