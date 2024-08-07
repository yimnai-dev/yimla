<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import {
		PanelLeft,
		Package2,
		Home,
		LineChart,
		Search,
		SettingsIcon,
		DockIcon,
		User2Icon,
		ArrowDownUp,
		SearchIcon
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
	class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
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
					href="/tkp"
					class="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
				>
					<Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
					<span class="sr-only">Thola Kimonganga</span>
				</a>
				<a
					href="/tkp"
					class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<Home class="h-5 w-5" />
					Home
				</a>
				<a
					href="/tkp/transactions"
					class="flex hidden items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<LineChart class="h-5 w-5" />
					Transactions
				</a>

				<a
					href="/tkp/medication"
					class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<DockIcon class="h-5 w-5" />
					Medication
				</a>
				<a
					href="/tkp/orders"
					class="flex hidden items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<ArrowDownUp class="h-5 w-5" />
					Orders
				</a>
				<a
					href="/tkp/customers"
					class="flex hidden items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<User2Icon class="h-5 w-5" />
					Customers
				</a>
				<a
					href="/tkp/search"
					class="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
				>
					<SearchIcon class="h-5 w-5" />
					Medication Search Portal
				</a>
				<a
					href="/tkp/settings"
					class="flex hidden items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
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
						href={segment === 'tkp' ? '/tkp' : `/${pathSegments.slice(0, idx + 1).join('/')}`}
						class="capitalize"
						>{segment === 'tkp'
							? 'Home'
							: segment.includes('-')
								? 'More Details'
								: segment}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				{#if pathSegments.length > 1 && idx !== pathSegments.length - 1}
					<Breadcrumb.Separator class="mx-2">/</Breadcrumb.Separator>
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="relative ml-auto flex-1 md:grow-0">
		<Search class="absolute left-2.5 top-2.5 hidden h-4 w-4 text-muted-foreground" />
		<Input
			type="search"
			placeholder="Search..."
			class="hidden w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
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
			<DropdownMenu.Label class="capitalize"
				>{$page.data.tkp.pharmacistInfo.firstName}'s Account</DropdownMenu.Label
			>

			<!-- <a href="/tkp/settings" class="block rounded-md border border-solid px-3 py-1 text-sm">
				<DropdownMenu.Label>Settings</DropdownMenu.Label>
			</a> -->

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
