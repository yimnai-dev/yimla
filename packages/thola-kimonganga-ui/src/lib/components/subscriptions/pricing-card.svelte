<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { getContext, onMount } from 'svelte';
	import { CONTEXT_KEYS } from '$lib/context-keys';
	import { page } from '$app/stores';
	import type { ToastState } from '../toast/toast-state.svelte';
	import Spinner from '../spinner/Spinner.svelte';
	import { cn } from '$lib/utils';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import {
		initializeCheckoutSchema,
		type InitializeCheckoutForm
	} from '$lib/forms/subscriptions.form';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		plan: {
			name: string;
			priceId: string;
			price: number;
			currency: string;
			image: string;
			features: string[];
			unit: string;
			productId: string;
		};
	};

	let checkoutForm = getContext<SuperValidated<InitializeCheckoutForm>>(CONTEXT_KEYS.CHECKOUT_FORM);

	let toastState = getContext<ToastState>(CONTEXT_KEYS.TOAST);

	let { plan }: Props = $props();

	let initializing = $state(false);

	const form = superForm(checkoutForm, {
		validators: zodClient(initializeCheckoutSchema),
		id: plan.productId,
		onSubmit: () => {
			initializing = true;
		},
		onError: ({ result }) => {
			if (result.type === 'error') {
				toastState.addToast({
					title: 'Operation Failed',
					message: result.error.message,
					type: 'error'
				});
			}
		},
		onResult: ({ result }) => {
			initializing = false;
			if (result.type === 'failure') {
				const errors = result.data?.form.errors;
				for (const key in errors) {
					toastState.addToast({
						type: 'error',
						message: errors[key][0]
					});
				}
				return;
			}
			if (result.type === 'success') {
				toastState.addToast({
					title: 'Operation Successful',
					type: 'success',
					message: result.data?.message,
					duration: 5
				});
				location.href = result.data?.paymentUrl;
			}
		}
	});

	const formattedPrice = Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: plan.currency
	}).format(plan.price);

	let { form: formData, enhance } = form;

	onMount(() => {
		if ($page.data.orgInfo) {
			$formData.customerId = $page.data.orgInfo.customerId;
		}
		$formData.currency = plan.currency;
		$formData.priceId = plan.priceId;
		$formData.productId = plan.productId;
	});
</script>

<div
	class="start flex w-full flex-col items-center justify-between rounded-md border p-5 shadow-sm shadow-accent transition-all duration-300 ease-in-out hover:border-purple-200"
>
	<h1 class="py-2 text-xl md:text-2xl lg:text-3xl">{plan.name}</h1>
	<h1 class="text-pretty py-2 text-xl uppercase text-primary md:text-2xl lg:text-3xl">
		{formattedPrice} <span class="capitalize"> / {plan.unit.slice(0, -1)}</span>
	</h1>
	<img src={plan.image} alt="Thola Kimonganga" />
	<h3 class="py-2 text-2xl">Features</h3>
	<ul class="list-inside list-disc">
		{#each plan.features as feature}
			<li>{feature}</li>
		{/each}
	</ul>
	<form
		method="POST"
		action="/app/subscriptions?/initializeSubscription"
		use:enhance
		class="flex flex-col items-start space-y-2 py-3"
	>
		<label for="basic-seats">Number of Seats</label>
		<Input type="number" name="seats" placeholder="1" bind:value={$formData.seats} min={1} />
		<Input name="customerId" hidden class="hidden" bind:value={$formData.customerId} />
		<Input name="priceId" hidden class="hidden" bind:value={$formData.priceId} />
		<Input name="productId" hidden class="hidden" bind:value={$formData.productId} />
		<Input name="currency" hidden class="hidden" bind:value={$formData.currency} />
		<Button
			type="submit"
			variant="outline"
			disabled={initializing || $formData.seats === 0}
			class={cn('px-20', initializing ? 'cursor-not-allowed' : 'cursor-pointer')}
		>
			{#if initializing}
				<Spinner />
				Initializing...
			{:else}
				Subscribe
			{/if}
		</Button>
	</form>
</div>
