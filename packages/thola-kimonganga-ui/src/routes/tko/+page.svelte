<script lang="ts">
	import PharmacyTableWrapper from '$lib/components/organisation/pharmacy-table-wrapper.svelte';
	import PharmacistTableWrapper from '$lib/components/organisation/pharmacist-table-wrapper.svelte';
	import MedicationTableWrapper from '$lib/components/shared/medication-table-wrapper.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { page } from '$app/stores';
</script>

<div class="container mx-auto flex flex-col items-center justify-center space-y-3 py-4">
	<h1 class="text-xl font-bold capitalize sm:text-2xl md:text-3xl lg:text-5xl">
		Hello, {$page.data.orgInfo.username}
	</h1>
	<p class="text-center">Welcome back to Thola Kimonganga</p>
</div>
<Separator />
<div class="flex flex-col gap-5 px-5">
	<PharmacyTableWrapper />
	<Separator />
	<PharmacistTableWrapper />
	<Separator />
	<MedicationTableWrapper />
	<Separator />
</div>
