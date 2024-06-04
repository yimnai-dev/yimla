<script lang="ts">
	import { page } from '$app/stores';
	import { LucideRabbit, Undo2, RotateCw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	let innerWidth = $state(0);

	let rabbitWidth = $derived.by(() => {
		if (innerWidth > 768) return 200;
		return 150;
	});

	onMount(() => {
		innerWidth = window.innerWidth;
	});
</script>

<svelte:window bind:innerWidth />

<div class="flex min-h-screen w-screen flex-col items-center justify-center space-y-4">
	<h1 class="text-3xl font-bold md:text-4xl">{$page.error?.message}</h1>
	<LucideRabbit size={rabbitWidth} />
	<p>
		{$page.status === 404
			? 'Are you sure this is the page you are looking for?'
			: 'Sorry, something went wrong.'}
	</p>

	<div class="flex items-center justify-center space-x-3">
		<Button variant="outline" href="/app">Go Back <Undo2 /></Button>
		<Button variant="outline" href="/app">Reload <RotateCw /></Button>
	</div>
</div>
