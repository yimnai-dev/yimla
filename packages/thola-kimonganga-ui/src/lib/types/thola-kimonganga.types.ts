import { THOLA_KIMONGANGA_URL } from "$lib/urls";

export type AccountSuffix = 'details' | 'update' | 'delete'

export type RequestURLSegment = 'login' | 'create' | 'email-verification' | 'forgot-password' | 'reset-password' | 'verify-session' | `pharmacy/${string}` | `account/${AccountSuffix}` | `pharmacist/${string}`;

export type PostRequestOptions<T = unknown> = {
    url: RequestURLSegment;
    input: T;
    fetcher?: typeof fetch;
    baseURL: BaseURL;
    options?: Omit<RequestInit, 'body'>
}


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
}


export type GetRequestOptions = {
    url: RequestURLSegment;
    fetcher?: typeof fetch;
    baseURL: BaseURL;
    options?: Omit<RequestInit, 'body'>
}

export type TholaApp = 'thola-client' | 'thola-org' | 'thola-pharmacy';

export type UserRole = 'organisation' | 'pharmacy' | 'admin' | 'user'

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
}

export type BaseURL = typeof THOLA_KIMONGANGA_URL.DEV[keyof typeof THOLA_KIMONGANGA_URL.DEV] | typeof THOLA_KIMONGANGA_URL.PROD[keyof typeof THOLA_KIMONGANGA_URL.PROD]

export type TholaApiError = {
    message: string;
    status: number;
    ok: false;
}

export type SuccessResponse<T = unknown> = {
    ok: true;
} & T;

export type TholaApiResponse<T = unknown> = TholaApiError | SuccessResponse<T>;

export type LoginResponse = TholaApiResponse<{ message: string; sessionKey: string; }>

export type LoginParameters = {
    email: string;
    password: string;
    role: UserRole;
};

export type OrganisationDetails = {
    organisationId: string;
    accountId: string;
    username: string;
    email: string;
    role: 'organisation';
}

export type CreateUserAccountParameters = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    confirmationCode: string;
    role: UserRole;
}

export type PharmacyListResponse = TholaApiResponse<{ pharmacies: Array<Pharmacy> }>

export type ResetPasswordParameters = {
    email: string;
    password: string;
    confirmationCode: string;
    role: UserRole;
}

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
}

export type VerifySessionParameters = {
    sessionKey: string;
}

export type BaseApiResponse = TholaApiResponse<{ message: string }>

export type OrganisationResponse = TholaApiResponse<{ organisation: OrganisationDetails; message: string }>

export type PharmacistListResponse = TholaApiResponse<{ pharmacists: Array<PharmacistDetails> }>

export type CreatePharmacyResponse = BaseApiResponse

export type VerifyEmailParameters = Omit<LoginParameters, 'password'>

export type VerifyEmailResponse = TholaApiResponse<{ message: string; }>

export type CreateUserAccountResponse = TholaApiResponse<{ message: string; }>

export type ResetPasswordResponse = BaseApiResponse

export type CreatePharmacistResponse = BaseApiResponse

export type VerifySessionResponse = TholaApiResponse

export type DeletePharmacistResponse = BaseApiResponse
