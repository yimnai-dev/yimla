import type { MedicationListResponse } from '$lib/types/thola-kimonganga.types';
import { queryOptions } from '@tanstack/svelte-query';

export function medicationListOptions(stream: Promise<MedicationListResponse>) {
	return queryOptions({
		queryKey: ['medication-list'],
		queryFn: async () => await stream,
		refetchOnMount: true
	});
}
