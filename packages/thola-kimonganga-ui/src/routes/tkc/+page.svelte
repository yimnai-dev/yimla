<script lang="ts">
	import RecommendationsTableWrapper from '$lib/components/tkc/user-recommendations-table-wrapper.svelte';
	import MedicationSearchPanel from '$lib/components/tkc/medication-search-panel.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { page } from '$app/stores';
	import SearchHistoryTableWrapper from '$lib/components/tkc/search-history-table-wrapper.svelte';
</script>

<div class="container mx-auto flex flex-col items-center justify-center space-y-3 py-4">
	<h1 class="text-xl font-bold capitalize sm:text-2xl md:text-3xl lg:text-5xl">
		Hello, {$page.data.tkc.userInfo.firstName + ' ' + $page.data.tkc.userInfo.lastName}
	</h1>
	<p class="text-center">Welcome back to Thola Kimonganga</p>
</div>
<Separator />
<MedicationSearchPanel />
<SearchHistoryTableWrapper />
<RecommendationsTableWrapper />
