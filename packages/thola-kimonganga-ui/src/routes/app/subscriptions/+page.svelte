<script lang="ts">
	import SubscriptionsTable from '$lib/components/subscriptions/subscriptions-table.svelte';
	import { LucideRabbit, PlusCircleIcon } from 'lucide-svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import LoadingSpinner from '$lib/components/spinner/LoadingSpinner.svelte';
	import dayjs from 'dayjs';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import PricingTable from '$lib/components/subscriptions/pricing-table.svelte';
	import { onMount, setContext } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	let stripe: Stripe | null = $state(null);

	let priceListQuery = createQuery({
		queryKey: ['priceList'],
		queryFn: async () => await data.streamed.stripePriceListStream
	});

	let showPriceTable = $state(false);

	let subscriptionListQuery = createQuery({
		queryKey: ['subscriptionList'],
		queryFn: async () => await $page.data.subscriptionListStream
	});

	setContext(CONTEXT_KEYS.CHECKOUT_FORM, data.initializeCheckoutForm);

	onMount(async () => {
			stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_TEST_KEY);
	});
</script>

<div class="flex flex-col gap-5">
	{#if showPriceTable}
		<div class="mx-auto mt-5 flex min-h-screen w-full">
			{#if $priceListQuery.isFetching}
				<LoadingSpinner size="lg" />
			{:else if $priceListQuery.data}
				{#if !$priceListQuery.data.ok}
					<div
						class="flex w-full flex-col items-center justify-center rounded-md border-2 py-5 shadow-md"
					>
						<h1>Sorry an Erro occured while fetching the price list</h1>
						<p>Please Try Again Later</p>
					</div>
				{:else}
					{@const priceList = $priceListQuery.data.priceList}
					{@const productList = $priceListQuery.data.productList}
					<PricingTable {stripe} {priceList} {productList} />
				{/if}
			{/if}
		</div>
	{:else if $subscriptionListQuery.isFetching}
		<LoadingSpinner size="lg" />
	{:else if $subscriptionListQuery.isError}
		<div class="container flex flex-col items-center justify-center border-2 border-dashed p-10">
			<h1>Oops, something went wrong</h1>
			<LucideRabbit size={150} />
			<p>Please try again later</p>
		</div>
	{:else if $subscriptionListQuery.data}
		{#if !$subscriptionListQuery.data.ok}
			<div class="container flex flex-col items-center justify-center border-2 border-dashed p-10">
				<h1>Could Not Load Your Subscriptions</h1>
				<LucideRabbit size={150} />
				<p>Please Try Again Later</p>
			</div>
		{:else}
			{@const subscriptionList = $subscriptionListQuery.data.subscriptionList}
			{#if !subscriptionList.length}
				<div
					class="container flex flex-col items-center justify-center border-2 border-dashed p-10"
				>
					<h1>No Results Found</h1>
					<LucideRabbit size={150} />
					<p>No Current Subscriptions</p>
					<Button variant="outline" onclick={() => (showPriceTable = !showPriceTable)}
						>Add Subscription <PlusCircleIcon /></Button
					>
				</div>
			{:else}
				{@const activeSubscriptions = subscriptionList.filter((sub) => sub.status === 'active')}
				{#if activeSubscriptions.length}
					{@const activeSubscription = activeSubscriptions.sort(
						(sub1, sub2) =>
							dayjs(sub1.current_period_end).unix() - dayjs(sub2.current_period_end).unix()
					)[0]}
					<div
						class="container mx-auto my-4 flex w-[97%] flex-col items-center justify-between rounded-md border-2 py-5"
					>
						<h1 class="text-center text-3xl font-bold">Your Current Subscription</h1>
						<p>
							Subscribed on: {dayjs(activeSubscription.current_period_start).format('MMM DD, YYYY')}
						</p>
						<p>Expires on: {dayjs(activeSubscription.current_period_end).format('MMM DD, YYYY')}</p>
					</div>
				{/if}
				<div class="container my-4 flex">
					<SubscriptionsTable {subscriptionList} />
				</div>
			{/if}
		{/if}
	{/if}
</div>
