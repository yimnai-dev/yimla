<script lang="ts" context="module">
	import { Home, Settings, History, FileClock } from 'lucide-svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import NavLink from '../shared/nav-link.svelte';
</script>

<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<Logo />
		<NavLink href="/tkc" label="Home">
			<Home />
		</NavLink>
		<NavLink href="/tkc/search-history" label="Search History">
			<History />
		</NavLink>
		<NavLink href="/tkc/recommendations" label="Recommendations">
			<FileClock />
		</NavLink>
	</nav>
	<nav class="mt-auto flex-col items-center gap-4 px-2 sm:py-5 hidden">
		<NavLink href="/tkc/settings" label="Settings">
			<Settings />
		</NavLink>
	</nav>
</aside>
