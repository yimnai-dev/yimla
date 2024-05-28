<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import {
		PanelLeft,
		Package2,
		Home,
		UsersRound,
		LineChart,
		Search,
		Hospital,
		ShieldPlus,
		SettingsIcon
	} from 'lucide-svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { afterNavigate, goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import ThemeToggler from '../theme/ThemeToggler.svelte';
	import { page } from '$app/stores';

	const logout: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await goto(result.location);
			}
		};
	};

	let pathSegments = $state($page.url.pathname.split('/').slice(1));

	afterNavigate(() => {
		pathSegments = $page.url.pathname.split('/').slice(1);
	});
</script>

<header
	class="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
>
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
				<PanelLeft class="h-5 w-5" />
				<span class="sr-only">Toggle Menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="sm:max-w-xs">
			<nav class="grid gap-6 text-lg font-medium">
				<a
					href="/app"
					class="bg-primary text-primary-foreground group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
				>
					<Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
					<span class="sr-only">Acme Inc</span>
				</a>
				<a
					href="/app"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<Home class="h-5 w-5" />
					Home
				</a>
				<a href="/app/pharmacies" class="text-foreground flex items-center gap-4 px-2.5">
					<Hospital class="h-5 w-5" />
					Pharmacies
				</a>
				<a
					href="/app/pharmacists"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<ShieldPlus class="h-5 w-5" />
					Pharmacists
				</a>
				<a
					href="/app/customers"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<UsersRound class="h-5 w-5" />
					Customers
				</a>
				<a
					href="/app/analytics"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<LineChart class="h-5 w-5" />
					Analytics
				</a>
				<a
					href="/app/settings"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<SettingsIcon class="h-5 w-5" />
					Settings
				</a>
			</nav>
		</Sheet.Content>
	</Sheet.Root>
	<Breadcrumb.Root class="hidden md:flex">
		<Breadcrumb.List>
			{#each pathSegments as segment, idx (segment)}
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href={segment === 'app' ? '/app' : `${pathSegments.slice(0, idx + 1).join('/')}`}
						class="capitalize">{segment === 'app' ? 'Home' : segment}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				{#if pathSegments.length > 1 && idx !== pathSegments.length - 1}
					<Breadcrumb.Separator class="mx-2">/</Breadcrumb.Separator>
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="relative ml-auto flex-1 md:grow-0">
		<Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
		<Input
			type="search"
			placeholder="Search..."
			class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
		/>
	</div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				variant="outline"
				size="icon"
				class="overflow-hidden rounded-full"
				builders={[builder]}
			>
				<img
					src="/images/placeholder-user.webp"
					width={36}
					height={36}
					alt="Avatar"
					class="overflow-hidden rounded-full"
				/>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#if $page.data.tholaApp === 'thola-org' && $page.data.orgInfo}
				<DropdownMenu.Label class="capitalize">{$page.data.orgInfo.username}'s Account</DropdownMenu.Label>
			{:else if $page.data.tholaApp === 'thola-pharmacy' && $page.data.pharmacistInfo && typeof $page.data.pharmacistInfo === 'object' && 'username' in $page.data.pharmacistInfo}
				<DropdownMenu.Label class="capitalize">{$page.data.pharmacistInfo.username}'s Account</DropdownMenu.Label>
			{:else if $page.data.tholaApp === 'thola-client' && $page.data.userInfo && typeof $page.data.userInfo === 'object' && 'firstName' in $page.data.userInfo}
				<DropdownMenu.Label class="capitalize">{$page.data.userInfo.firstName}'s Account</DropdownMenu.Label>
			{:else}
				<DropdownMenu.Label class="capitalize">My Account</DropdownMenu.Label>
			{/if}
			<a href="/app/settings" class="block rounded-md border border-solid px-3 py-1 text-sm">
				<DropdownMenu.Label>Settings</DropdownMenu.Label>
			</a>

			<DropdownMenu.Separator />
			<form method="POST" action="/auth/login?/logout" use:enhance={logout}>
				<Button type="submit" variant="outline" class="w-full justify-start bg-transparent">
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</Button>
			</form>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<ThemeToggler />
</header>
