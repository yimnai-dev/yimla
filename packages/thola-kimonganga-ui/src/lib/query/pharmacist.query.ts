import type { PharmacistListResponse } from "$lib/types/thola-kimonganga.types";
import { queryOptions } from "@tanstack/svelte-query";

export function organisationPharmacistListOptions(stream: Promise<PharmacistListResponse>) {
    return queryOptions({
        queryKey: ['pharmacist-list'],
        queryFn: async () => await stream,
        refetchOnMount: true
    })
}
