<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavigationSidebar from './navigation-sidebar.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<NavigationSidebar />
	{@render children()}
</div>
