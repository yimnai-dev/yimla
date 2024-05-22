// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { TholaApp, BaseURL, UserRole } from '$lib';

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
		}
		interface PageData {
			tholaApp: TholaApp;
			baseURL: BaseURL;
			userRole: UserRole;
		}

		interface Error {
			message: string;
			status: number;
		}
	}
}

export {};
