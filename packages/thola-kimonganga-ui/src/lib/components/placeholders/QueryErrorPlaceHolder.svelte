<script lang="ts">
	import type { CreateQueryResult } from '@tanstack/svelte-query';
	import { Squirrel } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';

	type Props = {
		query: CreateQueryResult;
	};

	let { query }: Props = $props();
</script>

{#if $query.isError}
	<div class="flex w-full flex-col items-center justify-center gap-3 rounded-md border-2 px-2 py-5">
		<h1>Oops, something went wrong</h1>
		<Squirrel size={48} />
		{#if $query.failureCount > 3}
			<Button onclick={() => $query.refetch()}>Try Again</Button>
		{/if}
	</div>
{/if}
