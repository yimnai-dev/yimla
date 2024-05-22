export const BASE_URL_DEV = "http://localhost:8080/api/v1" as const
export const BASE_URL_PROD = "https://thola-kimonganga-api.yimnai.dev/api/v1" as const

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
} as const