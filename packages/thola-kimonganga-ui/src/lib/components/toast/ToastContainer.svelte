<script lang="ts">
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { getContext } from 'svelte';
	import type { ToastState } from './toast-state.svelte';
	import Toast from './Toast.svelte';

	const toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);
	let { toasts } = $derived(toastState);
</script>

<div class="absolute right-2 top-2 z-50 flex flex-col gap-2">
	{#each toasts as toast (toast.key)}
		<Toast {toast} />
	{/each}
</div>
