// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { TholaApp } from '$lib';
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			tholaApp: TholaApp;
		}
		interface PageData {
			tholaApp: TholaApp;
		}
	}
}

export {};
