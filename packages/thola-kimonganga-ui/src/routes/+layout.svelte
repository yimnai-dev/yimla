<script>
	import ToastContainer from '$lib/components/toast/ToastContainer.svelte';
	import '../app.css';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { ModeWatcher } from 'mode-watcher';
	import { createToastState } from '$lib/components/toast/toast-state.svelte';
	import { setContext } from 'svelte';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

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

<ModeWatcher />
<ToastContainer />
{@render children()}
