<script lang="ts">
	import ThemeToggler from '$lib/components/theme/ThemeToggler.svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>


<div class="absolute top-0 flex w-full items-center justify-between p-3 max-md:bg-secondary max-md:shadow-xl container">
	<Logo />
	<ThemeToggler />
</div>
<div class="bg-primary flex flex-col min-h-screen w-full items-center justify-center dark:bg-inherit mt-12">
	{@render children()}
	<div class="flex items-center justify-center p-5">
		<h1 class="text-secondary dark:text-primary text-center text-xl">
			Welcome to Thola Kimonganga. Log into your account to continue
		</h1>
	</div>
</div>
