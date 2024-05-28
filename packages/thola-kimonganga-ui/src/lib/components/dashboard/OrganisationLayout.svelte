<script lang="ts">
	import type { Snippet } from 'svelte';
	import DashboardAside from './DashboardAside.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<DashboardAside />
	{@render children()}
</div>
