<script lang="ts">
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { getContext } from 'svelte';
	import type { CartState } from '../../../routes/tkc/cart.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import {
		ShoppingBag,
		ChevronUp,
		Trash2,
		ChevronDown,
		LucideRabbit,
		DoorClosed
	} from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	let cartState = getContext<CartState>(CONTEXT_KEYS.CART);

	let { cart, cartTotal, updateItem, remove } = $derived(cartState);

	let open = $state(false);

	const portal = (node: HTMLElement) => {
		document.body.appendChild(node);
		document.body.style.position = 'relative';
		return {
			update() {
				document.body.appendChild(node);
				document.body.style.position = 'relative';
			},
			destroy() {
				if (document.body.contains(node)) {
					document.body.removeChild(node);
					document.body.style.position = 'default';
				}
			}
		};
	};
</script>

{#if cart.length}
	<div
		class="align-center absolute bottom-2 left-12 z-50 flex hidden justify-center shadow-lg transition-all ease-out hover:-translate-y-3"
		use:portal
	>
		<Button variant="outline" onclick={() => (open = true)}>
			<ShoppingBag />
			<span class="ml-2">{cart.length}</span>
		</Button>
	</div>
{/if}

<Sheet.Root {open} onOpenChange={() => (open = !open)}>
	<Sheet.Content side="right">
		{#if cart.length}
			<Sheet.Header>
				<Sheet.Title>Cart Items</Sheet.Title>
				<Sheet.Description>Make changes to your cart here.</Sheet.Description>
			</Sheet.Header>
		{/if}
		<div class="grid gap-4 px-2 py-4">
			{#if cart.length}
				{#each cart as item (item.drugId)}
					{@const price = Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF' }).format(
						item.unitPrice
					)}
					<div class="flex justify-between">
						<div class="flex w-full flex-row items-center justify-start space-x-2">
							<Avatar.Root>
								<Avatar.Image
									src={`https://kgzrdwvmmyjoutwoeggw.supabase.co/storage/v1/object/public/thola-kimonganga/medication/${item.drugId}`}
									alt={item.name}
								/>
								<Avatar.Fallback>CN</Avatar.Fallback>
							</Avatar.Root>
							<span class="flex flex-col items-start space-y-1">
								<p class="capitalize">{item.name}</p>
								<p>{price} X {item.quantity}</p>
							</span>
						</div>
						<span class="flex items-center justify-center space-x-1">
							<span class="flex flex-col items-center justify-start space-y-[2px]">
								<ChevronUp
									class="cursor-pointer"
									onclick={() => updateItem(item.drugId, item.quantity + 1)}
								/>
								<p>{item.quantity}</p>
								{#if item.quantity > 0}
									<ChevronDown
										class="cursor-pointer"
										onclick={() => updateItem(item.drugId, item.quantity - 1)}
									/>
								{/if}
							</span>
							<Trash2 class="cursor-pointer" onclick={() => remove(item.drugId)} />
						</span>
					</div>
				{/each}
				<div class="flex w-full flex-row items-center justify-between">
					<p>Total:</p>
					<p>
						{Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF' }).format(cartTotal)}
					</p>
				</div>
			{:else}
				<div class="flex h-screen w-full flex-col items-center justify-center space-y-3">
					<h1 class="text-xl font-bold md:text-2xl lg:text-3xl">Cart is Empty</h1>
					<LucideRabbit size={100} />
					<p class="text-lg font-semibold md:text-xl lg:text-2xl">Add Medications to Cart</p>
					<Button variant="outline" onclick={() => (open = false)}
						>Close Cart &nbsp; <DoorClosed />
					</Button>
				</div>
			{/if}
		</div>
		{#if cart.length}
			<Sheet.Footer>
				<Sheet.Close asChild let:builder>
					<Button disabled={!cart.length} builders={[builder]} type="submit" class="w-full"
						>Checkout Items</Button
					>
				</Sheet.Close>
			</Sheet.Footer>
		{/if}
	</Sheet.Content>
</Sheet.Root>
