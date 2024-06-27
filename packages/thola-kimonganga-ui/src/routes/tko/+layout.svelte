<script lang="ts">
	import AppLayout from '$lib/components/organisation/app-layout.svelte';
	import Header from '$lib/components/organisation/header.svelte';

	let { children } = $props();
</script>

<AppLayout>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header />
		{@render children()}
	</div>
</AppLayout>
