// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { TholaApp, BaseURL, UserRole, type OrganisationDetails } from '$lib';
import type { QueryClient } from '@tanstack/svelte-query';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			tholaApp: TholaApp;
			baseURL: BaseURL;
			userRole: UserRole;
			orgInfo: OrganisationDetails;
			userInfo: unknown;
			pharmacistInfo: unknown;
		}
		interface PageData {
			tholaApp: TholaApp;
			baseURL: BaseURL;
			userRole: UserRole;
			orgInfo: OrganisationDetails;
			userInfo: unknown;
			pharmacistInfo: unknown;
			queryClient: QueryClient;
		}

		interface Error {
			message: string;
			status: number;
		}
	}
}

export {};
