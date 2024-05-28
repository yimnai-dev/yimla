<script lang="ts">
	import ToastContainer from '$lib/components/toast/ToastContainer.svelte';
	import '../app.css';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { ModeWatcher } from 'mode-watcher';
	import { createToastState } from '$lib/components/toast/toast-state.svelte';
	import { setContext } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types';

	type Props = {
		children: import('svelte').Snippet;
		data: LayoutData;
	};

	let { children, data }: Props = $props();

	let toastState = createToastState();

	setContext(CONTEXT_KEYS.TOAST, toastState);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<ToastContainer />
	{@render children()}
</QueryClientProvider>
