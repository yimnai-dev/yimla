<script lang="ts" context="module">
	import { page } from '$app/stores';
	import {
		Home,
		LineChart,
		Settings,
		UsersRound,
		Hospital,
		ShieldPlus,
		CreditCard,
		ArrowRightLeft,
		BriefcaseMedical,
		ListOrdered
	} from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Logo from '$lib/components/logo/Logo.svelte';
	import NavLink from './NavLink.svelte';

	// organisation links in dashboard
	/**
	 * - Home
	 * - Pharmacies
	 * - Pharmacists
	 * - Transactions
	 * - Medication
	 * - Subscription
	 * - Settings
	 */

	// pharmacy links in dashboard
	/**
	 * - Home
	 * - Medications
	 * - Orders
	 * - Transactions
	 * - Settings
	 * - Sell Medication
	 */

	// patient links in dashboard
	/**
	 * - Home - Medication Search Portal
	 * - Pharmacy Listing With Location in modal
	 * - Settings
	 * - Place Order
	 * - View Medication Details
	 * - View Order History
	 * - View Search History
	 */
</script>

<aside class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
	<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
		<a
			href="/"
			class="bg-primary text-primary-foreground group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
		>
			<Logo />
			<span class="sr-only">Thola Kimonganga</span>
		</a>
		<NavLink href="/app" label="Home">
			<Home />
		</NavLink>
		{#if $page.data.tholaApp === 'thola-org'}
			<NavLink href="/app/pharmacies" label="Pharmacies">
				<Hospital />
			</NavLink>
			<NavLink href="/app/pharmacists" label="Pharmacists">
				<ShieldPlus />
			</NavLink>
			<NavLink href="/app/subscriptions" label="Manage Subscription">
				<CreditCard />
			</NavLink>
		{/if}
		{#if $page.data.tholaApp === 'thola-org' || $page.data.tholaApp === 'thola-pharmacy'}
			<NavLink href="/app/transactions" label="Transactions">
				<ArrowRightLeft />
			</NavLink>
			<NavLink href="/app/medication" label="Medication">
				<BriefcaseMedical />
			</NavLink>
		{/if}
		{#if $page.data.tholaApp === 'thola-pharmacy'}
			<NavLink href="/app/orders" label="Orders">
				<ListOrdered />
			</NavLink>
		{/if}
		<NavLink href="/app/customers" label="Customers">
			<UsersRound />
		</NavLink>
		<NavLink href="/app/analytics" label="Analytics">
			<LineChart />
		</NavLink>
	</nav>
	<nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
		<NavLink href="/app/settings" label="Settings">
			<Settings />
		</NavLink>
	</nav>
</aside>
