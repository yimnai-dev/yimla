<script lang="ts">
    import {page} from '$app/stores'
	import MedicationTableWrapper from '$lib/components/medication/medication-table-wrapper.svelte';

    let pharmacistInfo = $state($page.data.pharmacistInfo)

</script>

<div class="flex flex-col gap-5 px-5">
    <MedicationTableWrapper />
</div>
