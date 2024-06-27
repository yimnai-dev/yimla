<script lang="ts" context="module">
	import { Home, Hospital, ShieldPlus, CreditCard, BriefcaseMedical } from 'lucide-svelte';
	import Logo from '$lib/components/logo/Logo.svelte';
	import NavLink from '../shared/nav-link.svelte';
</script>

<aside class="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<Logo />
		<NavLink href="/tko" label="Home">
			<Home />
		</NavLink>
		<NavLink href="/tko/pharmacies" label="Pharmacies">
			<Hospital />
		</NavLink>
		<NavLink href="/tko/pharmacists" label="Pharmacists">
			<ShieldPlus />
		</NavLink>
		<NavLink href="/tko/subscriptions" label="Manage Subscription">
			<CreditCard />
		</NavLink>
		<!-- <NavLink href="/tko/transactions" label="Transactions">
			<ArrowRightLeft />
		</NavLink> -->
		<NavLink href="/tko/medication" label="Medication">
			<BriefcaseMedical />
		</NavLink>
		<!-- <NavLink href="/tko/customers" label="Customers">
			<UsersRound />
		</NavLink>
		<NavLink href="/tko/analytics" label="Analytics">
			<LineChart />
		</NavLink> -->
	</nav>
	<!-- <nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
		<NavLink href="/tko/settings" label="Settings">
			<Settings />
		</NavLink>
	</nav> -->
</aside>
