import { redirect } from '@sveltejs/kit'

export const load = async ({ locals}) => {
    if (locals.tholaApp !== 'thola-org') {
        throw redirect(302, '/app');
    }
}