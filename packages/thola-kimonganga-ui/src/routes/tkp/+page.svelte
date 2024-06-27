<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronRight } from 'lucide-svelte';
	import MedicationTableWrapper from '$lib/components/shared/medication-table-wrapper.svelte';
</script>

<div class="container mx-auto flex flex-col items-center justify-center space-y-3 py-4">
	<h1 class="text-xl font-bold capitalize sm:text-2xl md:text-3xl lg:text-5xl">
		Hello, {$page.data.tkp.pharmacistInfo.firstName + ' ' + $page.data.tkp.pharmacistInfo.lastName}
	</h1>
	<p>Welcome back to Thola Kimonganga</p>
	<h1 class="text-xl font-bold capitalize md:text-2xl">
		Pharmacy Branch: {$page.data.tkp.pharmacistInfo.pharmacyName}
	</h1>
	<div class="flex w-full flex-col space-y-3">
		<!-- <h3>Quick Actions</h3> -->
		<div class="flex w-full space-x-2">
			<Button variant="outline" href="/tkp/medication"
				>Explore Medication Listing &nbsp; <ChevronRight /></Button
			>
			<!-- <Button variant="outline" href="/tkp/customers">View Customer Listing</Button> -->
			<!-- <Button variant="outline" href="/tkp/orders?status=pending">Pending Orders</Button> -->
		</div>
	</div>
</div>
<Separator />
<div class="flex flex-col gap-5 px-5">
	<MedicationTableWrapper />
</div>
