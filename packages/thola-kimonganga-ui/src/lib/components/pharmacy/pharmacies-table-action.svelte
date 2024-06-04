<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { goto, invalidateAll } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import dayjs from 'dayjs';
	import { getContext, onMount, untrack } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		updatePharmacyActiveStatusSchema,
		type UpdatePharmacyActiveStatusSchema
	} from '$lib/forms/pharmacy.form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ToastState } from '../toast/toast-state.svelte';

	type Props = {
		pharmacyId: string;
		activePharmacyCount: number;
		isActive: boolean;
	};

	let { pharmacyId, activePharmacyCount, isActive }: Props = $props();

	let subscriptionListQuery = createQuery({
		queryKey: ['subscriptionList'],
		queryFn: async () => await $page.data.subscriptionListStream
	});

	let canSubscribe = $derived.by(() => {
		if (!$subscriptionListQuery.data) return false;
		if (!$subscriptionListQuery.data.ok) return false;
		if (!$subscriptionListQuery.data.subscriptionList.length) return false;
		const activeSubscriptionList = $subscriptionListQuery.data.subscriptionList
			.filter((s) => s.status === 'active')
			.sort((a, b) => dayjs(a.current_period_end).unix() - dayjs(b.current_period_end).unix());
		const currentSubscription = activeSubscriptionList[0];
		const items = currentSubscription.items;
		if (!items.data.length) return false;
		const item = items.data[0];
		const seatCount = item.quantity;
		if (!seatCount) return false;
		return activePharmacyCount < seatCount;
	});

	let updatingPharmacyActiveStatus = $state(false);

	let updatePharmacySubscriptionForm = getContext<SuperValidated<UpdatePharmacyActiveStatusSchema>>(
		CONTEXT_KEYS.UPDATE_PHARMACY_SUBSCRIPTION_FORM
	);

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let form = superForm(updatePharmacySubscriptionForm, {
		id: `${Math.random()}_${pharmacyId}`,
		validators: zodClient(updatePharmacyActiveStatusSchema),
		resetForm: true,
		onSubmit: () => {
			updatingPharmacyActiveStatus = true;
		},
		onError: ({ result }) => {
			updatingPharmacyActiveStatus = false;
			if (result.type === 'error') {
				toastState.addToast({
					type: 'error',
					message: result.error.message
				});
			}
		},
		onResult: ({ result }) => {
			updatingPharmacyActiveStatus = false;
			if (result.type === 'success') {
				invalidateAll();
				toastState.addToast({
					type: 'success',
					message: 'Pharmacy status updated successfully'
				});
				return;
			}
			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({
						type: 'error',
						message: errors[key][0]
					});
				}
			}
		}
	});

	let { form: formData, enhance } = form;

	$effect(() => {
		$formData.isActive = !isActive;
		console.log(untrack(() => $formData));
	});

	onMount(() => {
		$formData.pharmacyId = pharmacyId;
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>More actions</DropdownMenu.Label>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />

		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				goto(`/app/pharmacies/${pharmacyId}/pharmacists`);
			}}
		>
			View pharmacists
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				goto(`/app/pharmacies/${pharmacyId}/edit`);
			}}
		>
			Edit Pharmacy Details
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				goto(`/app/pharmacies/${pharmacyId}`);
			}}
		>
			View pharmacy details
		</DropdownMenu.Item>
		<DropdownMenu.Item class="cursor-pointer" disabled={!isActive && !canSubscribe}>
			{#if isActive || canSubscribe}
				<form action="/app?/updatePharmacySubscription" method="POST" use:enhance>
					<input type="hidden" name="pharmacyId" bind:value={$formData.pharmacyId} />
					<input type="hidden" name="isActive" bind:value={$formData.isActive} />
					<Button type="submit" variant={isActive ? 'destructive' : 'outline'}
						>{updatingPharmacyActiveStatus
							? 'Updating...'
							: isActive
								? 'Remove From Subscription'
								: 'Add To Subscription'}</Button
					>
				</form>
			{:else}
				Maximum Subscription Reached
			{/if}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
