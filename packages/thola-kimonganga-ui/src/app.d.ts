// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import {
	TholaApp,
	BaseURL,
	UserRole,
	type OrganisationDetails,
	type CustomerDetails,
	type PharmacistDetails,
	type SubscriptionListResponse,
	type MedicationListResponse
} from '$lib';
import type { RemoveMedicationSchema, UpdateMedicationSchema } from '$lib/forms/medication.form';
import type { QueryClient } from '@tanstack/svelte-query';
import type { SuperValidated } from 'sveltekit-superforms';

interface Env {
	readonly VITE_MAPBOX_API_KEY: string;
	readonly VITE_STRIPE_PUBLISHABLE_TEST_KEY: string;
	readonly VITE_STRIPE_PRICING_TABLE_TEST_ID: string;
}

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
			userInfo: CustomerDetails;
			pharmacistInfo: PharmacistDetails;
			env: Env;
		}
		interface PageData {
			tholaApp: TholaApp;
			baseURL: BaseURL;
			userRole: UserRole;
			orgInfo: OrganisationDetails;
			userInfo: CustomerDetails;
			pharmacistInfo: PharmacistDetails;
			queryClient: QueryClient;
			subscriptionListStream: Promise<SubscriptionListResponse>;
			medicationListStream: Promise<MedicationListResponse>;
			deleteMedicationForm: SuperValidated<RemoveMedicationSchema>;
			updateMedicationForm: SuperValidated<UpdateMedicationSchema>;
			env: Env;
		}

		interface Error {
			message: string;
			status: number;
		}
	}
}

export {};
