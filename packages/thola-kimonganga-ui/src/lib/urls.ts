import type { PostRequestOptions, GetRequestOptions } from './types/thola-kimonganga.types';

export const BASE_URL_DEV = 'http://localhost:8080/api/v1' as const;
export const BASE_URL_PROD = 'https://thola-kimonganga-api.yimnai.dev/api/v1' as const;

export const THOLA_KIMONGANGA_URL = {
	DEV: {
		'thola-client': `${BASE_URL_DEV}/users`,
		'thola-pharmacy': `${BASE_URL_DEV}/pharmacy`,
		'thola-org': `${BASE_URL_DEV}/org`
	},
	PROD: {
		'thola-client': `${BASE_URL_PROD}/users`,
		'thola-pharmacy': `${BASE_URL_PROD}/pharmacy`,
		'thola-org': `${BASE_URL_PROD}/org`
	}
} as const;

export const post = async <TData = unknown, TInput = unknown>({
	url,
	input,
	fetcher = fetch,
	baseURL,
	options,
	isFormData
}: PostRequestOptions<TInput>): Promise<TData> => {
	const reqURL = `${baseURL}/${url}`;
	const response = await fetcher(reqURL, {
		...options,
		method: 'POST',
		body: isFormData ? (input as unknown as FormData) : JSON.stringify(input)
	});
	const json = await response.json<TData>();
	return json;
};

export const update = async <TData = unknown, TInput = unknown>({
	url,
	input,
	fetcher = fetch,
	baseURL,
	options,
	isFormData
}: PostRequestOptions<TInput, undefined>): Promise<TData> => {
	const reqURL = `${baseURL}/${url}`;
	const response = await fetcher(reqURL, {
		...options,
		method: 'PUT',
		body: isFormData ? (input as unknown as FormData) : JSON.stringify(input)
	});
	const json = await response.json<TData>();
	return json;
};

export const get = async <TData = unknown>({
	url,
	fetcher = fetch,
	baseURL,
	options
}: GetRequestOptions): Promise<TData> => {
	const reqURL = `${baseURL}/${url}`;
	const response = await fetcher(reqURL, {
		...options
	});
	const json = await response.json<TData>();
	return json;
};

export const deleteRequest = async <TData = unknown>({
	url,
	fetcher = fetch,
	baseURL,
	options
}: GetRequestOptions): Promise<TData> => {
	const reqURL = `${baseURL}/${url}`;
	const response = await fetcher(reqURL, {
		...options,
		method: 'DELETE'
	});
	const json = await response.json<TData>();
	return json;
};
