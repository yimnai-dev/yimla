<script lang="ts">
	import type { Toast } from '$lib';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { getContext, onMount } from 'svelte';
	import type { ToastState } from './toast-state.svelte';
	import { CircleX } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	type Props = {
		toast: Toast;
	};

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let { toast }: Props = $props();

	let toastActive = $derived(toastState.toasts.find((t) => t.key == toast.key));

	setTimeout(
		() => {
			toastState.removeToast(toast.key);
		},
		(toast.duration || 3) * 1000
	);
</script>

{#if toastActive}
	<div
		transition:fly={{ duration: 300, delay: 100, x: 100, y: 0 }}
		class="min-w-[100px] rounded-sm px-2 py-4 shadow-md z-50"
		class:bg-red-500={toast.type === 'error'}
		class:bg-green-500={toast.type === 'success'}
		class:bg-blue-500={toast.type === 'info'}
		class:bg-yellow-500={toast.type === 'warning'}
	>
		<div class="flex w-full items-center justify-between pb-3">
			<h1 class="font-bold">{toast.title || 'Notice!'}</h1>
		</div>
		<div class="flex w-full items-center justify-between gap-2">
			<p>{toast.message}</p>
			<CircleX class="cursor-pointer" onclick={() => toastState.removeToast(toast.key)} />
		</div>
	</div>
{/if}
