import { QueryClient } from '@tanstack/svelte-query';

export const load = ({ data }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: true,
				refetchOnReconnect: true,
				retry: (failureCount, error) => {
					if (error instanceof TypeError) {
						return false;
					} else {
						return failureCount < 3;
					}
				},
			}
		}
	});
	return {
		...data,
		queryClient
	};
};
