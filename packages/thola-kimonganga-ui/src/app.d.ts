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
		}

		interface Error {
			message: string;
			status: number;
		}
	}
}

export {};
