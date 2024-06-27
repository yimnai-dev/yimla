<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { ToastState } from '../toast/toast-state.svelte';
	import EditMedicationSidebar from './edit-medication-sidebar.svelte';
	import type { MedicationListResponse } from '$lib';
	import { medicationListOptions } from '$lib/query/medication.query';
	import { removeMedicationSchema } from '$lib/forms/medication.form';

	type Props = {
		drugId: string;
	};

	let { drugId }: Props = $props();

	let sidebarOpen = $state(false);

	function deleteMedicationFromQueryCache() {
		$page.data.queryClient.setQueryData<MedicationListResponse>(
			medicationListOptions(
				$page.data.tholaApp === 'thola-org'
					? $page.data.tko.medicationListStream
					: $page.data.tkp.medicationListStream
			).queryKey,
			(old) => {
				if (!old || !old.ok) return;
				const filtered = old.medications.filter((med) => med.drugId !== drugId);
				return {
					...old,
					medications: filtered
				};
			}
		);
	}

	let toastState: ToastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let form = superForm(
		$page.data.tholaApp === 'thola-org'
			? $page.data.tko.deleteMedicationForm
			: $page.data.tkp.deleteMedicationForm,
		{
			id: `delete_medication_${drugId}`,
			validators: zodClient(removeMedicationSchema),
			onSubmit: () => {
				deleteMedicationFromQueryCache();
			},
			onError: ({ result }) => {
				if (result.status === 401) {
					goto(`/auth/login?redirectTo=${$page.url.pathname}`);
					return;
				}
				toastState.addToast({ message: result.error.message, type: 'error' });
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
			}
		}
	);

	let { form: formData, enhance } = form;

	onMount(() => {
		$formData.drugId = drugId;
	});
</script>

{#if $page.data.tholaApp === 'thola-pharmacy'}
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

			<DropdownMenu.Item class="cursor-pointer py-4" onclick={() => (sidebarOpen = true)}
				>Edit Medication</DropdownMenu.Item
			>
			<form method="POST" use:enhance action="/tkp/?/deleteMedication">
				<input type="hidden" name="drugId" bind:value={$formData.drugId} />
				<DropdownMenu.Item class="cursor-pointer">
					<Button type="submit" variant="ghost">Delete Medication</Button>
				</DropdownMenu.Item>
			</form>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	{#if $page.data.tholaApp === 'thola-pharmacy'}
		<EditMedicationSidebar bind:open={sidebarOpen} {drugId} />
	{/if}
{/if}
