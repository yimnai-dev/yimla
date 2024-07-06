<script lang="ts">
	import '../app.css';
	import LoadingSpinner from '$lib/components/spinner/LoadingSpinner.svelte';
	import ToastContainer from '$lib/components/toast/ToastContainer.svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { ModeWatcher } from 'mode-watcher';
	import { createToastState } from '$lib/components/toast/toast-state.svelte';
	import { setContext } from 'svelte';
	import { onNavigate, beforeNavigate, afterNavigate } from '$app/navigation';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from '$lib/components/ui/sonner';
	import MetaData from '$lib/components/meta/meta-data.svelte';

	const SERVER_LOAD_TIMEOUT_MS = 1000;

	let { children, data } = $props();

	let pendingTimeout: ReturnType<typeof setTimeout> | undefined = $state();

	let toastState = createToastState();

	let serverPending = $state(false);

	setContext(CONTEXT_KEYS.TOAST, toastState);

	beforeNavigate(() => {
		pendingTimeout = setTimeout(() => {
			serverPending = true;
		}, SERVER_LOAD_TIMEOUT_MS);
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
				if (pendingTimeout) clearTimeout(pendingTimeout);
			});
		});
	});

	afterNavigate(() => {
		serverPending = false;
		if (pendingTimeout) clearTimeout(pendingTimeout);
	});
</script>

<MetaData />
<QueryClientProvider client={data.queryClient}>
	{#if serverPending}
		<LoadingSpinner size="lg" blur={false} isPageLoader={true} />
	{:else}
		<ModeWatcher />
		<Toaster />
		<ToastContainer />
		{@render children()}
	{/if}
</QueryClientProvider>
