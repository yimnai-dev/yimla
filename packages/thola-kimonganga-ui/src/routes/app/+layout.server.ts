import type { OrganisationResponse, PharmacistListResponse, PharmacyListResponse } from "$lib"
import { COOKIE_KEYS } from "$lib/cookie-keys"
import { deletePharmacistSchema } from "$lib/forms/pharmacist.form"
import { get } from "$lib/urls"
import { error } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async ({ locals, fetch, parent, cookies }) => {
    const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY)
    const deletePharmacistForm = await superValidate(zod(deletePharmacistSchema))
    if (locals.tholaApp === 'thola-org') {
        const orgDetailsResponse = await get<OrganisationResponse>({
            url: "account/details",
            fetcher: fetch,
            baseURL: locals.baseURL,
            options: {
                headers: {
                    "Authorization": sessionKey || ""
                }
            }
        })
        if (!orgDetailsResponse.ok) {
            error(orgDetailsResponse.status, {
                message: orgDetailsResponse.message,
                status: orgDetailsResponse.status
            })
        }
        locals.orgInfo = orgDetailsResponse.organisation
        return {
            orgInfo: orgDetailsResponse.organisation,
            userInfo: null,
            pharmacistInfo: null,
            deletePharmacistForm,
            pharmacyListStream: get<PharmacyListResponse>({
                url: `pharmacy/all/${orgDetailsResponse.organisation.organisationId}`,
                baseURL: locals.baseURL,
            fetcher: fetch,
                options: {
                    headers: {
                        "Authorization": sessionKey || ""
                    }
                }
            }),
            organisationPharmacistListStream: get<PharmacistListResponse>({
                url: `pharmacist/org/all/${orgDetailsResponse.organisation.organisationId}`,
                baseURL: locals.baseURL,
                fetcher: fetch,
                options: {
                    headers: {
                        "Authorization": sessionKey || ""
                    }
                }
            })
        }
    }
    return {
        ...await parent(),
        orgInfo: null
    }
}