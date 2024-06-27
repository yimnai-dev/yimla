<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PlusCircleIcon } from 'lucide-svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<div class="flex flex-col gap-5 px-5">
	{#if $page.url.pathname !== '/tko/pharmacies/new'}
		<div
			class="container mx-auto mt-5 flex items-center justify-center rounded-md border-2 border-dashed py-6"
		>
			<Button variant="outline" href="/tko/pharmacies/new">
				Create A New Pharmacy
				<PlusCircleIcon class="ml-2 h-4 w-4" />
			</Button>
		</div>
	{/if}
	{@render children()}
</div>
