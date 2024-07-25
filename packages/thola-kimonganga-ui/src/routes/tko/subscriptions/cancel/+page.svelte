<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LucideRabbit } from 'lucide-svelte';
	let orgInfo = $page.data.orgInfo;
</script>

<div class="container flex h-screen items-center justify-center">
	<div
		class="flex flex-col items-center justify-center space-y-3 rounded-md border-2 border-dashed p-10"
	>
		{#if orgInfo}
			<h1 class="text-2xl font-bold capitalize md:text-3xl lg:text-4xl">Hey, {orgInfo.username}</h1>
			<LucideRabbit size={150} />
			<p class="md:text-2x text-xl lg:text-3xl">
				Your subscription to Thola Kimonganga was not successful. Please try again later
			</p>
			<Button variant="outline" href="/tko/subscriptions">Go back to Subscriptions</Button>
		{/if}
	</div>
</div>
