<script lang="ts">
	import { page } from '$app/stores';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import OrganisationHome from '$lib/components/dashboard/organisation-home.svelte';
	import PharmacyHome from '$lib/components/dashboard/pharmacy-home.svelte';
	import CustomerHome from '$lib/components/dashboard/customer-home.svelte';
</script>

<h1>Thola Kimonganga mapbox: {import.meta.env.VITE_MAPBOX_API_KEY}</h1>
<h1>Thola Kimonganga stripe: {import.meta.env.VITE_STRIPE_PUBLISHABLE_TEST_KEY}</h1>

<div class="container mx-auto flex flex-col items-center justify-center space-y-3 py-4">
	<h1 class="text-xl font-bold capitalize sm:text-2xl md:text-3xl lg:text-5xl">
		Hello, {$page.data.orgInfo?.username ??
			$page.data.pharmacistInfo?.firstName + ' ' + $page.data.pharmacistInfo?.lastName ??
			$page.data.userInfo?.firstName + ' ' + $page.data.userInfo?.lastName}
	</h1>
	<p>Welcome back to Thola Kimonganga</p>
	{#if $page.data.tholaApp === 'thola-pharmacy' && $page.data.pharmacistInfo}
		<h1 class="text-xl font-bold capitalize md:text-2xl">
			Pharmacy Branch: {$page.data.pharmacistInfo.pharmacyName}
		</h1>
		<div class="flex w-full flex-col space-y-3">
			<h3>Quick Actions</h3>
			<div class="flex w-full space-x-2">
				<Button variant="outline" href="/app/medication">Explore Medication Listing</Button>
				<Button variant="outline" href="/app/customers">View Customer Listing</Button>
				<Button variant="outline" href="/app/orders?status=pending">Pending Orders</Button>
			</div>
		</div>
	{/if}
</div>
<Separator />
{#if $page.data.tholaApp === 'thola-org'}
	<OrganisationHome />
{:else if $page.data.tholaApp === 'thola-pharmacy'}
	<PharmacyHome />
{:else if $page.data.tholaApp === 'thola-client'}
	<CustomerHome />
{/if}
