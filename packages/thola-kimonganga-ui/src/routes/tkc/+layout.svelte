<script lang="ts">
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import AppLayout from '$lib/components/tkc/app-layout.svelte';
	import Header from '$lib/components/tkc/header.svelte';
	import { onMount, setContext } from 'svelte';
	import { createCart } from './cart.svelte';
	import Cart from '$lib/components/tkc/cart.svelte';

	let { children } = $props();

	let cartState = createCart();

	setContext(CONTEXT_KEYS.CART, cartState);

	onMount(() => {
		cartState.init();
	});
</script>

<AppLayout>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<Header />
		{@render children()}
		<Cart />
	</div>
</AppLayout>
