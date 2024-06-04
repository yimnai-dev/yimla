import { error } from "@sveltejs/kit";

export const load = () => {
    error(404, {
        message: 'Page Not Found',
        status: 404
    });
}