import { type Handle, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { sequence } from "@sveltejs/kit/hooks";

const SUB_DOMAIN_MAP = {
    'thola-client': 'tkc',
    'thola-org': 'tko',
    'thola-pharmacy': 'tkp'
}

type SubdomainKey = keyof typeof SUB_DOMAIN_MAP

const activeApp: 'tkc' | 'tko' | 'tkp' = 'tko'

const handleAppDomain: Handle = async ({ event, resolve }) => {
    if(dev) {
        if(!event.url.pathname.includes(activeApp)) {
            redirect(302, `/${activeApp}`)
        }
        return await resolve(event)
    }
    const domain = event.url.host
    const [subdomain] = domain
    const app = SUB_DOMAIN_MAP[subdomain as SubdomainKey]
    if (!event.url.pathname.includes(app)) {
        redirect(302, `/${app}`)
    }
    return await resolve(event)
}

export const handle = sequence(handleAppDomain)