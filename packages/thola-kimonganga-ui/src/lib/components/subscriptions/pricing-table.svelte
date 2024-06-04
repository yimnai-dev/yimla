<script lang="ts">
	import PricingCard from './pricing-card.svelte';
	import type { StripePrice, StripeProduct } from '$lib/types/thola-kimonganga.types';
	import { type Stripe } from '@stripe/stripe-js';

	type Props = {
		priceList: Array<StripePrice>;
		productList: Array<StripeProduct>;
		stripe: Stripe | null;
	};

	let { priceList, productList }: Props = $props();

	let plans = productList
		.map((prod) => {
			const priceObj = priceList.find((price) => price.product.id === prod.id);
			return {
				name: prod.name,
				priceId: priceObj?.id || '',
				price: priceObj?.unit_amount || 0,
				currency: priceObj?.currency || 'USD',
				image: prod.images[0],
				features: prod.marketing_features.map((feat) => feat.name),
				unit: prod.unit_label,
				productId: prod.id
			};
		})
		.sort((a, b) => a.price - b.price);
</script>

<div
	class="container mx-auto grid h-fit grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 [&>*:nth-child(even)]:border-primary [&>*:nth-child(odd)]:border-foreground"
>
	{#each plans as plan}
		<PricingCard {plan} />
	{/each}
</div>
