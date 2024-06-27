export const load = async ({ locals }) => {
	const tholaApp = locals.tholaApp;
	const baseURL = locals.baseURL;
	const userRole = locals.userRole;
	return {
		tholaApp,
		baseURL,
		userRole
	};
};
