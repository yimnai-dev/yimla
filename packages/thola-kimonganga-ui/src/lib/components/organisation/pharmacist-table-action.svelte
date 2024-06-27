<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { superForm } from 'sveltekit-superforms';
	import { deletePharmacistSchema } from '$lib/forms/pharmacist.form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ToastState } from '../toast/toast-state.svelte';
	import { page } from '$app/stores';
	import { organisationPharmacistListOptions } from '$lib/query/pharmacist.query';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import Spinner from '$lib/components/spinner/Spinner.svelte';

	type Props = {
		pharmacistId: string;
		pharmacyId: string;
		firstName: string;
	};

	let { pharmacistId, pharmacyId, firstName }: Props = $props();

	let deletingPharmacist = $state(false);

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let form = superForm($page.data.tko.deletePharmacistForm, {
		id: `delete_pharmacist_form_${pharmacistId}`,
		validators: zodClient(deletePharmacistSchema),
		onSubmit: () => {
			deletingPharmacist = true;
		},
		onError: ({ result }) => {
			deletingPharmacist = false;
			if (result.type === 'error') {
				toastState.addToast({
					title: 'Operation Failed',
					message: result.error.message,
					type: 'error'
				});
				return;
			}
		},
		onResult: ({ result }) => {
			deletingPharmacist = false;
			if (result.type === 'success') {
				toastState.addToast({
					title: 'Success',
					message: result.data?.message,
					type: 'success'
				});
				$page.data.queryClient.setQueryData(
					organisationPharmacistListOptions($page.data.tko.organisationPharmacistListResponse)
						.queryKey,
					(data) => {
						if (!data || !data.ok) return;
						return {
							...data,
							pharmacists: data.pharmacists.filter((p) => p.pharmacistId !== pharmacistId)
						};
					}
				);
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
			return;
		}
	});

	let { form: formData, enhance } = form;

	onMount(() => {
		$formData.pharmacistId = pharmacistId;
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

		<!-- <DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				goto(`/tko/pharmacies/${pharmacyId}/pharmacists`);
			}}
		>
			View Pharmacy Details
		</DropdownMenu.Item> -->
		<DropdownMenu.Item class="cursor-pointer">
			<form method="POST" action="/tko/pharmacists?/deletePharmacist" class="w-full" use:enhance>
				<Form.FormField {form} name="pharmacistId" class="grid gap-2">
					<Form.Control let:attrs>
						<Input hidden name={attrs.name} class="hidden" bind:value={$formData.pharmacistId} />
					</Form.Control>
				</Form.FormField>
				<Button type="submit" class="h-full w-full" variant="outline" disabled={deletingPharmacist}>
					{#if deletingPharmacist}
						<Spinner /> Deleting...
					{:else}
						Delete {firstName}
					{/if}
				</Button>
			</form>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
