<script lang="ts">
	import LoadingSpinner from '../spinner/LoadingSpinner.svelte';
	import { pharmacyListOptions } from '$lib/query/pharmacy.query';
	import { createQuery } from '@tanstack/svelte-query';
	import QueryErrorPlaceHolder from '../placeholders/QueryErrorPlaceHolder.svelte';
	import PharmaciesTable from './pharmacies-table.svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight, LucideRabbit, PlusCircleIcon } from 'lucide-svelte';

	let pharmaciesQuery = createQuery({
		...pharmacyListOptions($page.data.pharmacyListStream),
		refetchOnMount: true
	});
</script>

{#if $pharmaciesQuery.isFetching}
	<LoadingSpinner size="lg" />
{:else if $pharmaciesQuery.isError}
	<QueryErrorPlaceHolder query={pharmaciesQuery} />
{:else if $pharmaciesQuery.data && $pharmaciesQuery.data.ok}
	{@const pharmacies = $pharmaciesQuery.data.pharmacies || []}
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Pharmacy Listing</h1>
		{#if $page.url.pathname === '/app'}
			<div class="flex items-center justify-center gap-2">
				<Button variant="outline" href="/tko/pharmacies/new">
					Create New Pharmacy
					<PlusCircleIcon class="ml-2 h-4 w-4" />
				</Button>
				<Button variant="outline" size="sm" href="/tko/pharmacies"
					>View More
					<ChevronRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		{/if}
	</div>
	{#if pharmacies.length === 0}
		<div class="flex w-full flex-col items-center justify-center space-y-4">
			<h1 class="text-xl md:text-2xl lg:text-3xl">No Pharmacies found</h1>
			<LucideRabbit size={150} />
			<Button variant="outline" href="/tko/pharmacies/new"
				>Add A Pharmacy &nbsp; <PlusCircleIcon />
			</Button>
		</div>
	{:else}
		<PharmaciesTable
			pharmacies={$page.url.pathname === '/tko/pharmacies' ? pharmacies : pharmacies.slice(0, 5)}
		/>
	{/if}
{/if}
