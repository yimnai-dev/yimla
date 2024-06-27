<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { afterNavigate } from '$app/navigation';

	type Props = {
		href: string;
		label: string;
		children: Snippet;
	};

	let { href, label, children: icon }: Props = $props();

	let activeClass = $state($page.url.pathname === href ? 'bg-accent' : '');

	let classList = $derived.by(() => {
		const defaultClasses =
			'text-muted-foreground hover:text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8';
		return cn(defaultClasses, activeClass);
	});

	afterNavigate(() => {
		activeClass = $page.url.pathname === href ? 'bg-accent' : '';
	});
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<a {href} class={classList} use:builder.action {...builder}>
			{@render icon()}
			<span class="sr-only">{label}</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content side="right">{label}</Tooltip.Content>
</Tooltip.Root>
