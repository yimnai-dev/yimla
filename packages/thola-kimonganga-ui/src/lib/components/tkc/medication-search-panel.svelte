<script lang="ts">
	import type { SearchMedicationSchema } from '$lib/forms/medication.form';
	import MedicationSearchFilters from './medication-search-filters.svelte';
	import SearchMedicationList from './search-medication-list.svelte';

	let medications: Array<SearchMedicationSchema> = $state([]);
</script>

<div class="container mx-auto">
	<MedicationSearchFilters bind:medications />
	<SearchMedicationList {medications} fromSearch={true} />
</div>
