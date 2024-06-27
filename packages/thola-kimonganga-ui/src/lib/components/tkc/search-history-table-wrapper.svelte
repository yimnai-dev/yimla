<script lang="ts">
	import SearchMedicationList from './search-medication-list.svelte';
	import { userSearchHistoryOptions } from '$lib/query/medication.query';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import LoadingSpinner from '../spinner/LoadingSpinner.svelte';
	import QueryErrorPlaceHolder from '../placeholders/QueryErrorPlaceHolder.svelte';
	import { Button } from '$lib/components/ui/button';
	import { LucideRabbit, SearchIcon } from 'lucide-svelte';

	const searchHistoryQuery = createQuery(
		userSearchHistoryOptions($page.data.tkc.userRecommendationsStream)
	);

	const tableTitle = 'Search History';
	const tablePlaceholder = 'filter search history...';

	let medications = $derived.by(() => {
		if ($searchHistoryQuery.data && $searchHistoryQuery.data.ok)
			return $searchHistoryQuery.data.medications;
		return [];
	});
</script>

{#if $searchHistoryQuery.isFetching}
	<LoadingSpinner size="lg" />
{:else if $searchHistoryQuery.isError}
	<QueryErrorPlaceHolder query={searchHistoryQuery} />
{:else if $searchHistoryQuery.data && $searchHistoryQuery.data.ok}
	{#if medications.length === 0}
		<div class="flex w-full flex-col items-center justify-center space-y-4">
			<h1 class="text-xl md:text-2xl lg:text-3xl">No history found.</h1>
			<p class="text-center">Start searching and your search history will appear here</p>
			<LucideRabbit size={150} />
			{#if $page.url.pathname.startsWith('/tkc/search-history')}
				<Button variant="outline" href="/tkc">You have no search history. <SearchIcon /></Button>
			{/if}
		</div>
	{:else}
		<div class="container mx-auto">
			<SearchMedicationList title={tableTitle} filterPlaceholder={tablePlaceholder} {medications} fromSearch={true} />
		</div>
	{/if}
{/if}
