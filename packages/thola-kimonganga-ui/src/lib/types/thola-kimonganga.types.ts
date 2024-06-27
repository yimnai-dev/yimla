import type { SearchMedicationSchema } from '$lib/forms/medication.form';
import { THOLA_KIMONGANGA_URL } from '$lib/urls';
import type Stripe from 'stripe';

export type SubscriptionSuffix =
	| 'price-list'
	| 'product-price-list'
	| `initialize-checkout/${string}`
	| `pharmacies/update/${string}`
	| string;

export type AccountSuffix = 'details' | 'update' | 'delete';

export type MedicationSuffix =
	`${'search' | 'create' | 'all' | 'delete' | 'update' | 'recommendations' | 'search-history'}${string}`;

export type RequestURLSegment =
	| 'login'
	| 'create'
	| 'email-verification'
	| 'forgot-password'
	| 'reset-password'
	| 'verify-session'
	| `pharmacy/${string}`
	| `account/${AccountSuffix}`
	| `pharmacist/${string}`
	| `subscriptions/${SubscriptionSuffix}`
	| `pharmacist/pharma/all/${string}`
	| `pharmacist/org/all/${string}`
	| `medication/update-search-history/${string}/${string}`
	| `medication/${MedicationSuffix}`;

export type PostRequestOptions<T = unknown, OptionalInput = undefined> = {
	url: RequestURLSegment;
	input: OptionalInput extends undefined ? Partial<T> : T;
	fetcher?: typeof fetch;
	baseURL: BaseURL;
	options?: Omit<RequestInit, 'body'>;
	isFormData?: boolean;
};

export type LocationData = {
	status: string;
	country: string;
	countryCode: string;
	region: string;
	regionName: string;
	city: string;
	zip: string;
	lat: number;
	lon: number;
	timezone: string;
	isp: string;
	org: string;
	as: string;
	query: string;
};

export type Pharmacy = {
	pharmacyId: string;
	organisationId: string;
	name: string;
	createdOn: string;
	updatedOn: string;
	isActive: boolean;
	geoLocation: string;
	country: string;
	region: string;
	city: string;
	address: string;
};

export type LoggedUserDetails = {
	userId: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
};

export type GetRequestOptions = {
	url: RequestURLSegment;
	fetcher?: typeof fetch;
	baseURL: BaseURL;
	options?: Omit<RequestInit, 'body'>;
};

export type TholaApp = 'thola-client' | 'thola-org' | 'thola-pharmacy';

export type UserRole = 'organisation' | 'pharmacy' | 'admin' | 'user' | 'pharmacist';

export type Toast = {
	/**
	 * @default 'Information'
	 */
	title?: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	/**
	 * Duration in seconds
	 */
	duration?: number;
	/**
	 * Unique Identifier for each toast
	 */
	key: string;
};

export type PricingPlan = {
	name: string;
	price: string;
	includes: Array<string>;
};

export type BaseURL =
	| (typeof THOLA_KIMONGANGA_URL.DEV)[keyof typeof THOLA_KIMONGANGA_URL.DEV]
	| (typeof THOLA_KIMONGANGA_URL.PROD)[keyof typeof THOLA_KIMONGANGA_URL.PROD];

export type TholaApiError = {
	message: string;
	status: number;
	ok: false;
};

export type SuccessResponse<T = unknown> = {
	ok: true;
} & T;

export type TholaApiResponse<T = unknown> = TholaApiError | SuccessResponse<T>;

export type LoginResponse = TholaApiResponse<{ message: string; sessionKey: string }>;

export type LoginParameters = {
	email: string;
	password: string;
	role: UserRole;
};

export type MedicationDetails = {
	drugId: string;
	name: string;
	description: string;
	manufacturer: string;
	category: string;
	strength: string;
	quantity: number;
	price: number;
	expiryDate: string;
	dosageForm: string;
	instructions: string;
	storageConditions: string;
	stockId: string;
	createdOn: string;
	updatedOn: string;
};

export type OrganisationDetails = {
	organisationId: string;
	customerId: string;
	accountId: string;
	username: string;
	email: string;
	role: 'organisation';
};

export type CustomerDetails = {
	userId: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
};

export type CreateUserAccountParameters = {
	firstName: string;
	lastName: string;
	username: string;
	password: string;
	email: string;
	confirmationCode: string;
	role: UserRole;
};

export type PharmacyListResponse = TholaApiResponse<{ pharmacies: Array<Pharmacy> }>;

export type LoggedUserResponse = TholaApiResponse<{ user: LoggedUserDetails }>;

export type MedicationSearchResponse = TholaApiResponse<{
	medications: Array<SearchMedicationSchema>;
}>;

export type ResetPasswordParameters = {
	email: string;
	password: string;
	confirmationCode: string;
	role: UserRole;
};

export type PharmacistDetails = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	phoneNumber: string;
	pharmacyName: string;
	pharmacyId: string;
	pharmacistId: string;
	joinedOn: string;
};

export type StripePrice = {
	active: boolean;
	billing_scheme: string;
	created: number;
	currency: string;
	currency_options: null;
	custom_unit_amount: null;
	deleted: boolean;
	id: string;
	livemode: boolean;
	lookup_key: string;
	metadata: object;
	nickname: string;
	object: string;
	product: {
		active: boolean;
		created: number;
		default_price: null;
		deleted: boolean;
		description: string;
		id: string;
		images: null;
		livemode: boolean;
		marketing_features: null;
		metadata: null;
		name: string;
		object: string;
		package_dimensions: null;
		shippable: boolean;
		statement_descriptor: string;
		tax_code: null;
		type: string;
		unit_label: string;
		updated: number;
		url: string;
	};
	recurring: {
		aggregate_usage: string;
		interval: string;
		interval_count: number;
		meter: string;
		trial_period_days: number;
		usage_type: string;
	};
	tax_behavior: string;
	tiers: null;
	tiers_mode: string;
	transform_quantity: null;
	type: string;
	unit_amount: number;
	unit_amount_decimal: string;
};

export type StripeProduct = {
	active: boolean;
	created: number;
	default_price: string | null;
	deleted: boolean;
	description: string;
	id: string;
	images: Array<string>;
	livemode: boolean;
	marketing_features: Array<{ name: string }>;
	metadata: object;
	name: string;
	object: string;
	package_dimensions: null;
	shippable: boolean;
	statement_descriptor: string;
	tax_code: {
		description: string;
		id: string;
		name: string;
		object: string;
	};
	type: string;
	unit_label: string;
	updated: number;
	url: string;
};

export type VerifySessionParameters = {
	sessionKey: string;
};

export type BaseApiResponse = TholaApiResponse<{ message: string }>;

export type OrganisationResponse = TholaApiResponse<{
	organisation: OrganisationDetails;
	message: string;
}>;

export type PharmacistDetailsResponse = TholaApiResponse<{
	pharmacist: PharmacistDetails;
	message: string;
}>;

export type PharmacistListResponse = TholaApiResponse<{ pharmacists: Array<PharmacistDetails> }>;

export type CreatePharmacyResponse = BaseApiResponse;

export type VerifyEmailParameters = Omit<LoginParameters, 'password'>;

export type VerifyEmailResponse = TholaApiResponse<{ message: string }>;

export type CreateUserAccountResponse = TholaApiResponse<{ message: string }>;

export type ResetPasswordResponse = BaseApiResponse;

export type CreatePharmacistResponse = BaseApiResponse;

export type VerifySessionResponse = TholaApiResponse;

export type DeletePharmacistResponse = BaseApiResponse;

export type AddPharmacyToSubscriptionResponse = BaseApiResponse;

export type RemovePharmacyFromSubscriptionResponse = BaseApiResponse;

export type StripePriceListResponse = TholaApiResponse<{
	priceList: Array<StripePrice>;
	productList: Array<StripeProduct>;
}>;

export type InitializeSubscriptionSessionResponse = TholaApiResponse<{
	message: string;
	paymentUrl: string;
}>;

export type SubscriptionListResponse = TholaApiResponse<{
	subscriptionList: Stripe.Subscription[];
}>;

export type CreateMedicationResponse = TholaApiResponse<{ message: string; drugId: string }>;

export type MedicationDetailsResponse = TholaApiResponse<{
	message: string;
	medication: MedicationDetails;
}>;

export type MedicationListResponse = TholaApiResponse<{
	message: string;
	medications: Array<MedicationDetails>;
}>;
