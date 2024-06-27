<script lang="ts">
	import SearchMedicationList from './search-medication-list.svelte';
	import { userSearchHistoryOptions } from '$lib/query/medication.query';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import LoadingSpinner from '../spinner/LoadingSpinner.svelte';
	import QueryErrorPlaceHolder from '../placeholders/QueryErrorPlaceHolder.svelte';
	import { Button } from '$lib/components/ui/button';
	import { LucideRabbit, SearchIcon } from 'lucide-svelte';

	const userRecommendationsQuery = createQuery(
		userSearchHistoryOptions($page.data.tkc.medicationsearchHistorytream)
	);

	const tableTitle = 'Medication Recommendations';
	const tablePlaceholder = 'filter recommendations...';

	let medications = $derived.by(() => {
		if ($userRecommendationsQuery.data && $userRecommendationsQuery.data.ok)
			return $userRecommendationsQuery.data.medications;
		return [];
	});
</script>

{#if $userRecommendationsQuery.isFetching}
	<LoadingSpinner size="lg" />
{:else if $userRecommendationsQuery.isError}
	<QueryErrorPlaceHolder query={userRecommendationsQuery} />
{:else if $userRecommendationsQuery.data && $userRecommendationsQuery.data.ok}
	{#if medications.length === 0}
		<div class="flex w-full flex-col items-center justify-center space-y-4">
			<h1 class="text-xl md:text-2xl lg:text-3xl">No recommendations found.</h1>
			<p class="text-center">Start searching and your recommendations will appear here</p>
			<LucideRabbit size={150} />
			{#if $page.url.pathname.startsWith('/tkc/recommendations')}
				<Button variant="outline" href="/tkc"
					>You have no recommendations yet. <SearchIcon /></Button
				>
			{/if}
		</div>
	{:else}
		<div class="container mx-auto">
			<SearchMedicationList
				title={tableTitle}
				filterPlaceholder={tablePlaceholder}
				{medications}
				fromSearch={true}
			/>
		</div>
	{/if}
{/if}
