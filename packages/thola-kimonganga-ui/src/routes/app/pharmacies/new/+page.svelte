<script lang="ts">
	import CreatePharmacyForm from '$lib/components/pharmacy/CreatePharmacyForm.svelte';

	let { data } = $props();

</script>

<CreatePharmacyForm {data} />