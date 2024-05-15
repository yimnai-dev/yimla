import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";

export function load () {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: Infinity,
                refetchInterval: Infinity,
                enabled: browser
            }
        }
    });

    return {
        queryClient
    }
}