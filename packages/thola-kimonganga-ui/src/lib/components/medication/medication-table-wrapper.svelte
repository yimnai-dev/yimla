<script lang="ts">
	import { medicationListOptions } from '$lib/query/medication.query';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import LoadingSpinner from '../spinner/LoadingSpinner.svelte';
	import QueryErrorPlaceHolder from '../placeholders/QueryErrorPlaceHolder.svelte';
	import { LucideRabbit } from 'lucide-svelte';
	import MedicationTable from './medication-table.svelte';

	let medicationListQuery = createQuery(medicationListOptions($page.data.medicationListStream));

	let medications = $derived.by(() => {
		if (
			!$medicationListQuery.data ||
			!$medicationListQuery.data.ok ||
			!$medicationListQuery.data.medications.length
		)
			return [];
		return $medicationListQuery.data.medications;
	});
</script>

{#if $medicationListQuery.isFetching}
	<LoadingSpinner size="lg" />
{:else if $medicationListQuery.isError}
	<QueryErrorPlaceHolder query={medicationListQuery} />
{:else if $medicationListQuery.data && $medicationListQuery.data.ok}
	{#if medications.length}
		<h1 class="text-xl font-bold sm:text-2xl md:text-3xl">Medications</h1>
		<MedicationTable {medications} />
	{:else}
		<div class="flex w-full flex-col items-center justify-center space-y-4">
			<h1 class="text-xl md:text-2xl lg:text-3xl">No medications found</h1>
			<LucideRabbit size={150} />
		</div>
	{/if}
{:else}
	{@const msg = $medicationListQuery.data?.message}
	<div class="flex w-full flex-col items-center justify-center space-y-4">
		<h1 class="text-xl md:text-2xl lg:text-3xl">{msg}</h1>
		<LucideRabbit size={150} />
	</div>
{/if}
