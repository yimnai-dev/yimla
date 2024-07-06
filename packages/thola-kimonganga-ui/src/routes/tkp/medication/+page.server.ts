export const load = async ({ parent }) => {
	const { tkp } = await parent();
	return {
		meta: {
			title: `Thola Kimonganga | ${tkp.pharmacistInfo.pharmacyName} . Medications`,
			description: `Thola Kimonganga | ${tkp.pharmacistInfo.pharmacyName} . Medications`,
			url: `/tkp/medication`
		}
	};
};
