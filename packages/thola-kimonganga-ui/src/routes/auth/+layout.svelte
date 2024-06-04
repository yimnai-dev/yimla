<script lang="ts">
	import ThemeToggler from '$lib/components/theme/ThemeToggler.svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="container absolute top-0 flex w-full items-center justify-between p-3 max-md:bg-secondary max-md:shadow-xl"
>
	<Logo />
	<ThemeToggler />
</div>
<div class="mt-12 flex min-h-screen w-full flex-col items-center justify-center dark:bg-inherit">
	{@render children()}
	<div class="flex items-center justify-center p-5">
		<h1 class="text-center text-xl">
			Welcome to Thola Kimonganga. {$page.url.pathname.includes('login')
				? 'Log into your account to continue'
				: $page.url.pathname.includes('signup')
					? 'Create an account to continue'
					: $page.url.pathname.includes('forgot-password')
						? 'Enter your email to recover your password'
						: $page.url.pathname.includes('reset-password')
							? 'Reset your password'
							: ''}
		</h1>
	</div>
</div>
