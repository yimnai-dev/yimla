<script lang="ts">
	import PharmacyTableWrapper from '$lib/components/pharmacy/pharmacies-table-wrapper.svelte';
	import PharmacistsTableWrapper from '$lib/components/pharmacist/pharmacist-table-wrapper.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import MedicationTableWrapper from '$lib/components/medication/medication-table-wrapper.svelte';
</script>

<div class="flex flex-col gap-5 px-5">
	<PharmacyTableWrapper />
	<Separator />
	<PharmacistsTableWrapper />
	<MedicationTableWrapper />
</div>
