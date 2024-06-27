<script lang="ts">
	import LoadingSpinner from '../spinner/LoadingSpinner.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import QueryErrorPlaceHolder from '../placeholders/QueryErrorPlaceHolder.svelte';
	import PharmacistsTable from './pharmacist-table.svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight, LucideRabbit, PlusCircleIcon } from 'lucide-svelte';
	import { organisationPharmacistListOptions } from '$lib/query/pharmacist.query';

	let pharmaciesQuery = createQuery(
		organisationPharmacistListOptions($page.data.tko.organisationPharmacistListResponse)
	);
</script>

{#if $pharmaciesQuery.isFetching}
	<LoadingSpinner size="lg" />
{:else if $pharmaciesQuery.isError}
	<QueryErrorPlaceHolder query={pharmaciesQuery} />
{:else if $pharmaciesQuery.data && $pharmaciesQuery.data.ok}
	{@const pharmacists = $pharmaciesQuery.data.pharmacists.length
		? $pharmaciesQuery.data.pharmacists
		: []}
	<div
		class="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:space-y-3"
	>
		<h1 class="text-xl font-bold">Pharmacists Listing</h1>
		{#if $page.url.pathname === '/tko'}
			<div class="flex items-center justify-center gap-2 max-sm:flex-col max-sm:items-start">
				<Button variant="outline" href="/tko/pharmacists/new">
					Create New Pharmacist
					<PlusCircleIcon class="ml-2 h-4 w-4" />
				</Button>
				<Button variant="outline" size="sm" href="/tko/pharmacists"
					>View More
					<ChevronRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		{/if}
	</div>
	{#if pharmacists.length === 0}
		<div class="flex w-full flex-col items-center justify-center space-y-4">
			<h1 class="text-xl md:text-2xl lg:text-3xl">No Pharmacists found</h1>
			<LucideRabbit size={150} />
			<Button variant="outline" href="/tko/pharmacists/new"
				>Add A Pharmacist &nbsp; <PlusCircleIcon />
			</Button>
		</div>
	{:else}
		<PharmacistsTable
			pharmacists={$page.url.pathname === '/tko/pharmacists'
				? pharmacists
				: pharmacists?.slice(0, 5)}
		/>
	{/if}
{/if}
