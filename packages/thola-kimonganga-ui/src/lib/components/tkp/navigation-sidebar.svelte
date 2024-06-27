<script lang="ts" context="module">
	import {
		Home,
		Settings,
		// UsersRound,
		// ArrowRightLeft,
		BriefcaseMedical,
		SearchIcon,
		// ArrowDownUp,
	} from 'lucide-svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import NavLink from '../shared/nav-link.svelte';
</script>

<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<Logo />
		<NavLink href="/tkp" label="Home">
			<Home />
		</NavLink>
		<NavLink href="/tkp/medication" label="Medication">
			<BriefcaseMedical />
		</NavLink>
		<!-- <NavLink href="/tkp/orders" label="Orders">
			<ArrowDownUp />
		</NavLink> -->
		<!-- <NavLink href="/tkp/customers" label="Customers">
			<UsersRound />
		</NavLink>
		<NavLink href="/tkp/transactions" label="Transactions">
			<ArrowRightLeft />
		</NavLink> -->
		<NavLink href="/tkp/search" label="Medication Search">
			<SearchIcon />
		</NavLink>
	</nav>
	<!-- <nav class="mt-auto flex-col items-center gap-4 px-2 sm:py-5 hidden">
		<NavLink href="/tkp/settings" label="Settings">
			<Settings />
		</NavLink>
	</nav> -->
</aside>
