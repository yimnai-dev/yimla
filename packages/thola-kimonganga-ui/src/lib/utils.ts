import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import type { Cookies } from '@sveltejs/kit';
import { get, update } from './urls';
import type { BaseURL, LocationData, MedicationListResponse, MedicationSearchResponse, PharmacistListResponse, PharmacyListResponse, SubscriptionListResponse } from './types/thola-kimonganga.types';
import { COOKIE_KEYS } from './cookie-keys';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};


type PharmacyListProps = {
	cookies: Cookies;
	orgId: string;
	fetcher: typeof fetch;
	baseURL: BaseURL
}

type SubscriptionListProps = {
	cookies: Cookies;
	fetcher: typeof fetch;
	baseURL: BaseURL;
	customerId: string
}

export async function getPharmacyList({ cookies, orgId, fetcher, baseURL }: PharmacyListProps) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<PharmacyListResponse>({
		url: `pharmacy/all/${orgId}`,
		baseURL,
		fetcher,
		options: {
			headers: {
				Authorization: sessionKey
			}
		}
	})
}


export async function getSubscriptionList({ cookies, fetcher, baseURL, customerId }: SubscriptionListProps) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<SubscriptionListResponse>({
		url: `subscriptions/${customerId}`,
		baseURL,
		fetcher,
		options: {
			headers: {
				Authorization: sessionKey
			}
		}
	})
}

type PharmacistListProps = {
	cookies: Cookies;
	fetcher: typeof fetch;
	baseURL: BaseURL;
	url: `pharmacist/pharma/all/${string}` | `pharmacist/org/all/${string}`
}


export async function getPharmacistList({ cookies, fetcher, baseURL, url }: PharmacistListProps) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<PharmacistListResponse>({
		url: url,
		baseURL,
		fetcher,
		options: {
			headers: {
				Authorization: sessionKey
			}
		}
	})
}


type MedicationListProps = Omit<SubscriptionListProps, 'customerId'> & { organisationId: string; }


export async function getOrgMedicationList({ organisationId, fetcher, baseURL, cookies }: MedicationListProps) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<MedicationListResponse>({
		url: `medication/all/${organisationId}`,
		baseURL,
		fetcher,
		options: {
			headers: {
				Authorization: sessionKey
			}
		}
	})
}


export async function getPharmacyMedicationList({ pharmacyId, fetcher, baseURL, cookies }: Omit<MedicationListProps, 'organisationId'> & { pharmacyId: string }) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<MedicationListResponse>({
		url: `medication/all/${pharmacyId}`,
		baseURL,
		fetcher,
		options: {
			headers: {
				Authorization: sessionKey
			}
		}
	})
}

type MedicationRecommendationProps = {
	userId: string;
	baseURL: BaseURL;
	cookies: Cookies;
	fetcher: typeof fetch
}

export async function getSearchHistory({ userId, baseURL, cookies, fetcher }: MedicationRecommendationProps) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<MedicationSearchResponse>({
		baseURL,
		fetcher,
		url: `medication/search-history/${userId}`,
		options: {
			headers: {
				"Authorization": sessionKey
			}
		}
	})
}

export async function getUserRecommendations({ userId, baseURL, cookies, fetcher }: MedicationRecommendationProps) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await get<MedicationSearchResponse>({
		baseURL,
		fetcher,
		url: `medication/recommendations/${userId}`,
		options: {
			headers: {
				"Authorization": sessionKey
			}
		}
	})
}

export async function updateRecommendationIndex({ userId, baseURL, medicationId, cookies, fetcher }: MedicationRecommendationProps & { medicationId: string; }) {
	const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
	if (!sessionKey) throw new Error('Session key not found');
	return await update<MedicationSearchResponse>({
		baseURL,
		url: `medication/update-search-history/${userId}/${medicationId}`,
		input: {},
		fetcher,
		options: {
			headers: {
				Authorization: sessionKey
			}
		}
	})
}

export async function getDeviceLocationInfo(key: string) {
	return await fetch(`https://pro.ip-api.com/json/129.0.60.59?fields=country,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query&key=${key}`).then(res => res.json()) as unknown as LocationData
}