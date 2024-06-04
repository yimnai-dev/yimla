<script lang="ts">
	import PricingCard from './pricing-card.svelte';
	import type { StripePrice, StripeProduct } from '$lib/types/thola-kimonganga.types';
	import { type Stripe, type StripeElements } from '@stripe/stripe-js';
	import { Stripe as Str } from 'stripe';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import { createMutation } from '@tanstack/svelte-query';
	import { getContext } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import type { ToastState } from '../toast/toast-state.svelte';
	import Button from '../ui/button/button.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		priceList: Array<StripePrice>;
		productList: Array<StripeProduct>;
		stripe: Stripe | null;
	};

	const toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let { priceList, productList, stripe }: Props = $props();

	let clientSecret = $state<string | null>(null);

	let elements = $state<StripeElements | undefined>(undefined);

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

	const confirmPaymentMutation = createMutation({
		mutationKey: ['confirm-payment'],
		mutationFn: async () => {
			if (!stripe || !elements) return null;
			return await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `/subscriptions/success`
				}
			});
		},
		onError: (err) => {
			toastState.addToast({
				title: 'Operation Failed',
				message: err.message,
				type: 'error'
			});
		},
		onSuccess: (data) => {
			if (!data) return;
			if (data.error && data.error.message) {
				toastState.addToast({
					title: 'Operation Failed',
					message: data.error.message,
					type: 'error'
				});
				return;
			}
			toastState.addToast({
				title: 'Success',
				message: 'Subscription created successfully',
				type: 'success'
			});
		}
	});

	function confirmSubscription() {
		$confirmPaymentMutation.mutate()
	}
</script>

<div
	class="[&>*:nth-child(even)]:border-primary [&>*:nth-child(odd)]:border-foreground container mx-auto grid h-fit grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3"
>
	<!-- {#if clientSecret && stripe} -->
		<!-- <Elements mode="subscription" bind:elements {stripe} {clientSecret} >
			<PaymentElement/>
		</Elements>
		<Button variant="outline" onclick={confirmSubscription} disabled={$confirmPaymentMutation.isPending} class={cn($confirmPaymentMutation.isPending ? 'cursor-not-allowed' : '')}>Confirm Subscription</Button> -->
	<!-- {:else} -->
		{#each plans as plan}
			<PricingCard {plan} />
		{/each}
	<!-- {/if} -->
</div>
