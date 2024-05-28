<script lang="ts">
	import LoadingSpinner from '../spinner/LoadingSpinner.svelte';
	import { pharmacyListOptions } from '$lib/query/pharmacy.query';
	import { createQuery } from '@tanstack/svelte-query';
	import QueryErrorPlaceHolder from '../placeholders/QueryErrorPlaceHolder.svelte';
	import PharmaciesTable from './pharmacies-table.svelte';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { PharmacyListResponse } from '$lib/types/thola-kimonganga.types';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight, PlusCircleIcon } from 'lucide-svelte';

	let pharmacyListStream = getContext<Promise<PharmacyListResponse>>(
		CONTEXT_KEYS.PHARMACY_LIST_STREAM
	);

	let pharmaciesQuery = createQuery(pharmacyListOptions(pharmacyListStream));
</script>

{#if $pharmaciesQuery.isFetching}
	<LoadingSpinner size="lg" />
{:else if $pharmaciesQuery.isError}
	<QueryErrorPlaceHolder query={pharmaciesQuery} />
{:else if $pharmaciesQuery.data && $pharmaciesQuery.data.ok}
	{@const pharmacies = $pharmaciesQuery.data.pharmacies}
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold">Pharmacy Listing</h1>
		{#if $page.url.pathname === '/app'}
			<div class="flex items-center justify-center gap-2">
				<Button variant="outline" href="/app/pharmacies/new">
					Create New Pharmacy
					<PlusCircleIcon class="ml-2 h-4 w-4" />
				</Button>
				<Button variant="outline" size="sm" href="/app/pharmacies"
					>View More
					<ChevronRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		{/if}
	</div>
	<PharmaciesTable
		pharmacies={$page.url.pathname === '/app/pharmacies' ? pharmacies : pharmacies.slice(0, 5)}
	/>
{/if}
