<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import {
		PanelLeft,
		Package2,
		Home,
		Search,
		History,
		SettingsIcon,
		FileClock
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
					href="/tkc"
					class="bg-primary text-primary-foreground group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
				>
					<Package2 class="h-5 w-5 transition-all group-hover:scale-110" />
					<span class="sr-only">Thola Kimonganga</span>
				</a>
				<a
					href="/tkc"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<Home class="h-5 w-5" />
					Home
				</a>
				<a
					href="/tkc/search-history"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<History class="h-5 w-5" />
					Search History
				</a>
				<a
					href="/tkc/recommendations"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
				>
					<FileClock class="h-5 w-5" />
					Recommendations
				</a>
				<a
					href="/tkc/settings"
					class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5 hidden"
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
						href={segment === 'tkc' ? '/tkc' : `/${pathSegments.slice(0, idx + 1).join('/')}`}
						class="capitalize"
						>{segment === 'tkc'
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
		<Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4 hidden" />
		<Input
			type="search"
			placeholder="Search..."
			class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px] hidden"
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
			<DropdownMenu.Label class="capitalize">{ $page.data.tkc.userInfo.username }'s Account</DropdownMenu.Label>

			<a href="/tkc/settings" class="rounded-md border border-solid px-3 py-1 text-sm hidden">
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
