export const load = async ({ locals }) => {
	const tholaApp = locals.tholaApp;
	const baseURL = locals.baseURL;
	const userRole = locals.userRole;
	const env = locals.env;
	return {
		tholaApp,
		baseURL,
		userRole,
		env
	};
};
