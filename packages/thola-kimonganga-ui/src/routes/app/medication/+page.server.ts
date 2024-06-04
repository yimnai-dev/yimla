import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
    if(locals.tholaApp !== 'thola-org' && locals.tholaApp !== 'thola-pharmacy') {
        redirect(302, '/app')
    }
}
