<script lang="ts">
	import CreatePharmacyTrigger from '$lib/components/pharmacy/CreatePharmacyTrigger.svelte';
	import PharmacyTableWrapper from '$lib/components/pharmacy/pharmacies-table-wrapper.svelte';
</script>

<div class="flex flex-col gap-5">
	<CreatePharmacyTrigger />
	<PharmacyTableWrapper />
</div>
