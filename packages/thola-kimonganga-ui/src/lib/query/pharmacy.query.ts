import type { PharmacyListResponse } from "$lib/types/thola-kimonganga.types";
import { queryOptions } from "@tanstack/svelte-query";

export function pharmacyListOptions(stream: Promise<PharmacyListResponse>) {
    return queryOptions({
        queryKey: ['pharmacy-list'],
        queryFn: async () => await stream,
        refetchOnMount: true
    })
}