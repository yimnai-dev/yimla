import type { LoggedUserResponse } from '$lib';
import { COOKIE_KEYS } from '$lib/cookie-keys';
import { searchMedicationParametersSchema } from '$lib/forms/medication.form';
import { get } from '$lib/urls';
import { getDeviceLocationInfo, getSearchHistory, getUserRecommendations } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit'
import { superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals, cookies, fetch, platform }) => {
    if (locals.tholaApp !== 'thola-client') {
        redirect(302, '/auth/login')
    }

    const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY);
    if (!sessionKey) {
        redirect(302, '/auth/login')
    }

    const loggedUserResponse = await get<LoggedUserResponse>({
        url: 'account/details',
        fetcher: fetch,
        baseURL: locals.baseURL,
        options: {
            headers: {
                Authorization: sessionKey
            }
        }
    })
    if (!loggedUserResponse.ok) {
        error(loggedUserResponse.status, {
            message: loggedUserResponse.message,
            status: loggedUserResponse.status
        })
    }
    return {
        tkc: {
            userInfo: loggedUserResponse.user,
            searchMedicationForm: await superValidate<Infer<typeof searchMedicationParametersSchema>, { d: string }>(zod(searchMedicationParametersSchema)),
            medicationsearchHistorytream: getSearchHistory({
                userId: loggedUserResponse.user.userId,
                baseURL: locals.baseURL,
                fetcher: fetch,
                cookies
            }),
            userRecommendationsStream: getUserRecommendations({
                userId: loggedUserResponse.user.userId,
                baseURL: locals.baseURL,
                fetcher: fetch,
                cookies
            }),
            locationInfo: await getDeviceLocationInfo(platform?.env?.VITE_IP_IPA_KEY || ''),
            mapBoxApiKey: platform?.env.VITE_MAPBOX_API_KEY,
        }
    }
}