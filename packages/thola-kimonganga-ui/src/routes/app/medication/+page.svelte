<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import { PlusCircleIcon } from 'lucide-svelte';
	import MedicationTableWrapper from '$lib/components/medication/medication-table-wrapper.svelte';
	import { page } from '$app/stores';
</script>

<div class="container flex flex-col gap-5">
	{#if $page.data.tholaApp === 'thola-pharmacy'}
		<div
			class="container mx-auto mt-5 flex items-center justify-center rounded-md border-2 border-dashed py-6"
		>
			<Button variant="outline" href="/app/medication/new">
				Create New Medication
				<PlusCircleIcon class="ml-2 h-4 w-4" />
			</Button>
		</div>
	{/if}
	<MedicationTableWrapper />
</div>
