<script lang="ts">
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import CreatePharmacistTrigger from '$lib/components/pharmacist/create-pharmacist-trigger.svelte';
	import PharmacistsTableWrapper from '$lib/components/pharmacist/pharmacist-table-wrapper.svelte';
	import { setContext } from 'svelte';

	let { data } = $props();

</script>

<div class="flex flex-col gap-5">
	<CreatePharmacistTrigger />
	<PharmacistsTableWrapper />
</div>
