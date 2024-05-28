<script lang="ts">
	import { page } from '$app/stores';
	import { Separator } from '$lib/components/ui/separator';
	import OrganisationHome from '$lib/components/dashboard/organisation-home.svelte';
</script>

<div class="container mx-auto flex flex-col items-center justify-center space-y-3 py-4">
	<h1 class="text-xl font-bold capitalize sm:text-2xl md:text-3xl lg:text-5xl">
		Hello, {$page.data.orgInfo
			? $page.data.orgInfo.username
			: $page.data.pharmacistInfo
				? $page.data.pharmacistInfo
				: 'Pharmacist'
					? $page.data.userInfo
					: 'User'}
	</h1>
	<p>Welcome back to Thola Kimonganga</p>
</div>
<Separator />
{#if $page.data.tholaApp === 'thola-org'}
	<OrganisationHome />
{/if}
