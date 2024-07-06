export const load = async ({ parent }) => {
	const { orgInfo } = await parent();
	return {
		meta: {
			title: `Thola Kimonganga | ${orgInfo.username.toUpperCase()} - Organisation`,
			description: `Thola Kimonganga | ${orgInfo.username.toUpperCase()} - Organisation`,
			url: `/tko`
		}
	};
};
