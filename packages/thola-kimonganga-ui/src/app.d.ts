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
	type MedicationListResponse,
	type PharmacyListResponse,
	type PharmacistListResponse,
	type LoggedUserDetails,
	type LocationData,
	type MedicationSearchResponse
} from '$lib';
import type {
	RemoveMedicationSchema,
	SearchMedicationParametersSchema,
	UpdateMedicationSchema
} from '$lib/forms/medication.form';
import type { DeletePharmacistSchema } from '$lib/forms/pharmacist.form';
import type { UpdatePharmacyActiveStatusSchema } from '$lib/forms/pharmacy.form';
import type { QueryClient } from '@tanstack/svelte-query';
import type { SuperValidated } from 'sveltekit-superforms';

interface Env {
	readonly VITE_MAPBOX_API_KEY: string;
	readonly VITE_STRIPE_PUBLISHABLE_TEST_KEY: string;
	readonly VITE_STRIPE_PRICING_TABLE_TEST_ID: string;
	readonly VITE_IP_IPA_KEY: string;
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
			pharmacyListStream: Promise<PharmacyListResponse>;
			tko: {
				organisationPharmacistListResponse: Promise<PharmacistListResponse>;
				deletePharmacistForm: SuperValidated<DeletePharmacistSchema>;
				pharmacyListStream: Promise<PharmacyListResponse>;
				subscriptionListStream: Promise<SubscriptionListResponse>;
				medicationListStream: Promise<MedicationListResponse>;
				deleteMedicationForm: SuperValidated<RemoveMedicationSchema>;
				updateMedicationForm: SuperValidated<UpdateMedicationSchema>;
				updatePharmacyActiveStatusForm: SuperValidated<UpdatePharmacyActiveStatusSchema>;
				locationInfo: LocationData;
			};
			tkp: {
				pharmacistInfo: PharmacistDetails;
				medicationListStream: Promise<MedicationListResponse>;
				deleteMedicationForm: SuperValidated<RemoveMedicationSchema>;
				updateMedicationForm: SuperValidated<UpdateMedicationSchema>;
				searchMedicationForm: SuperValidated<SearchMedicationParametersSchema>;
				locationInfo: LocationData;
				mapBoxApiKey?: string;
			};
			tkc: {
				userInfo: LoggedUserDetails;
				searchMedicationForm: SuperValidated<SearchMedicationParametersSchema>;
				locationInfo: LocationData;
				mapBoxApiKey?: string;
				medicationsearchHistorytream: Promise<MedicationSearchResponse>;
				userRecommendationsStream: Promise<MedicationSearchResponse>;
			};
		}

		interface Error {
			message: string;
			status: number;
		}
	}
}

export {};
