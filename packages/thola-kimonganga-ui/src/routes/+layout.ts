import { QueryClient } from '@tanstack/svelte-query';

export const load = ({ data }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: true,
				retry: (failureCount, error) => {
					if (error instanceof TypeError) {
						return false;
					} else {
						return failureCount < 3;
					}
				},
				staleTime: 1000 * 60 * 60
			}
		}
	});
	return {
		...data,
		queryClient
	};
};
