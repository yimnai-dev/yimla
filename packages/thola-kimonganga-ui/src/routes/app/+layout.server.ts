import type { MedicationListResponse, OrganisationResponse, PharmacistDetailsResponse, PharmacistListResponse, PharmacyListResponse, SubscriptionListResponse } from "$lib"
import { COOKIE_KEYS } from "$lib/cookie-keys"
import { removeMedicationSchema, updateMedicationSchema } from "$lib/forms/medication.form.js"
import { deletePharmacistSchema } from "$lib/forms/pharmacist.form"
import { updatePharmacyActiveStatusSchema } from "$lib/forms/pharmacy.form"
import { get } from "$lib/urls"
import { error } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async ({ locals, fetch, parent, cookies }) => {
    const sessionKey = cookies.get(COOKIE_KEYS.SESSION_KEY)
    const pharmacistInfoResponse = await get<PharmacistDetailsResponse>({
        url: "account/details",
        fetcher: fetch,
        baseURL: locals.baseURL,
        options: {
            headers: {
                "Authorization": sessionKey || ""
            }
        }
    })
    const pharmacistInfo = pharmacistInfoResponse.ok ? pharmacistInfoResponse.pharmacist : null
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
            sessionKey: sessionKey || '',
            orgInfo: orgDetailsResponse.organisation,
            userInfo: null,
            pharmacistInfo: null,
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
            }),
            subscriptionListStream: get<SubscriptionListResponse>({
                url: `subscriptions/${orgDetailsResponse.organisation.customerId}`,
                baseURL: locals.baseURL,
                fetcher: fetch,
                options: {
                    headers: {
                        "Authorization": sessionKey || ""
                    }
                }
            }),
            medicationListStream: get<MedicationListResponse>({
                url: `medication/all/org/${orgDetailsResponse.organisation.organisationId}`,
                baseURL: locals.baseURL,
                fetcher: fetch,
                options: {
                    headers: {
                        "Authorization": sessionKey || ""
                    }
                }
            }),
            deletePharmacistForm: await superValidate(zod(deletePharmacistSchema)),
            updatePharmacyActiveStatusForm: await superValidate(zod(updatePharmacyActiveStatusSchema))
        }
    }
    return {
        ...await parent(),
        orgInfo: null,
        pharmacistInfo,
        medicationListStream: get<MedicationListResponse>({
            url: `medication/all/pharma/${pharmacistInfo?.pharmacyId}`,
            baseURL: locals.baseURL,
            fetcher: fetch,
            options: {
                headers: {
                    "Authorization": sessionKey || ""
                }
            }
        }),
        deleteMedicationForm: await superValidate(zod(removeMedicationSchema)),
        updateMedicationForm: await superValidate(zod(updateMedicationSchema))
    }
}