import { THOLA_KIMONGANGA_URL } from "$lib/urls";

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

export type VerifyEmailResponse = TholaApiResponse<{ message: string; }>

export type CreateUserAccountResponse = TholaApiResponse<{ message: string; }>

export type ResetPasswordResponse = TholaApiResponse<{ message:  string }>

export type VerifySessionResponse = TholaApiResponse
