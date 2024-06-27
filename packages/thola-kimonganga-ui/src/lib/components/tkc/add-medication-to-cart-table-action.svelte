<script lang="ts">
	import type { SearchMedicationSchema } from '$lib/forms/medication.form';
	import { Button } from '$lib/components/ui/button';
	import { ShoppingCart } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { CartState } from '../../../routes/tkc/cart.svelte';

	type Props = {
		medication: SearchMedicationSchema;
	};

	let { medication }: Props = $props();

	let cartState = getContext<CartState>(CONTEXT_KEYS.CART);

	let { add, remove } = $derived(cartState);

	let cartItem = $derived(cartState.getCartItem(medication.drugId));
</script>

{#if cartItem}
	<Button variant="destructive" onclick={() => remove(medication.drugId)}
		>Delete &nbsp; <ShoppingCart /></Button
	>
{:else}
	<Button
		variant="outline"
		onclick={() =>
			add({
				drugId: medication.drugId,
				quantity: 1,
				unitPrice: medication.price,
				name: medication.name
			})}>Add &nbsp; <ShoppingCart /></Button
	>
{/if}
