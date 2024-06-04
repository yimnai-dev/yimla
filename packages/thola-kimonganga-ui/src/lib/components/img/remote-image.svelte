<script lang="ts">
	import { onMount } from 'svelte';
	import { AlertTriangle } from 'lucide-svelte';

	type Props = {
		src: string;
		alt?: string;
	};

	let { src, alt = 'A remote image' }: Props = $props();

	let loading = $state(false);
	let exists = $state(false);

	onMount(() => {
		fetch(src)
			.then((i) => {
				loading = false;
				if (i && i.ok) {
					exists = true;
				}
			})
			.catch(() => {
				loading = false;
			});
	});
</script>

{#if !loading && exists}
	<img {src} {alt} class="rounded-md" />
{:else}
	<div class="flex w-full items-center justify-center p-3">
		<AlertTriangle size={100} />
	</div>
{/if}
