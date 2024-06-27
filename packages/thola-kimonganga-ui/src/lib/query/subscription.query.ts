import type {
	StripePriceListResponse,
	SubscriptionListResponse
} from '$lib/types/thola-kimonganga.types';
import { queryOptions } from '@tanstack/svelte-query';

export function subscriptionListOptions(stream: Promise<SubscriptionListResponse>) {
	return queryOptions({
		queryKey: ['subscriptionList', stream],
		queryFn: async () => await stream
	});
}

export function stripPriceListOptions(stream: Promise<StripePriceListResponse>) {
	return queryOptions({
		queryKey: ['stripPriceList', stream],
		queryFn: async () => await stream
	});
}
