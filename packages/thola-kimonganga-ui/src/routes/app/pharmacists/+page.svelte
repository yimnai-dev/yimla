<script lang="ts">
	import CreatePharmacistTrigger from '$lib/components/pharmacist/create-pharmacist-trigger.svelte';
	import PharmacistsTableWrapper from '$lib/components/pharmacist/pharmacist-table-wrapper.svelte';

</script>

<div class="flex flex-col gap-5">
	<CreatePharmacistTrigger />
	<PharmacistsTableWrapper />
</div>
