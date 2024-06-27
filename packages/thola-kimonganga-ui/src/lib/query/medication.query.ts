import type { MedicationListResponse, MedicationSearchResponse } from '$lib/types/thola-kimonganga.types';
import { queryOptions } from '@tanstack/svelte-query';

export function medicationListOptions(stream: Promise<MedicationListResponse>) {
	return queryOptions({
		queryKey: ['medication-list'],
		queryFn: async () => await stream,
		refetchOnMount: true
	});
}


export function userSearchHistoryOptions(stream: Promise<MedicationSearchResponse>) {
	return queryOptions({
		queryKey: ['user-search-history', stream],
		queryFn: async () => await stream
	})
}

export function userRecommendationsOptions(stream: Promise<MedicationSearchResponse>) {
	return queryOptions({
		queryKey: ['medication-recommendations', stream],
		queryFn: async () => await stream
	})
}