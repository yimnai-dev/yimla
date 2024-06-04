<script lang="ts">
	import CreatePharmacistForm from '$lib/components/pharmacist/create-pharmacist-form.svelte';

	let { data } = $props();
</script>

<CreatePharmacistForm {data} />
