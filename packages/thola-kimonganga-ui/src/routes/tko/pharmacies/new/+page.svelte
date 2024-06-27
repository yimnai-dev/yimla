<script lang="ts">
	import CreatePharmacyForm from '$lib/components/organisation/create-pharmacy-form.svelte';


	let { data } = $props();
</script>

<CreatePharmacyForm {data} />
