import type { Toast } from "$lib/types/thola-kimonganga.types";

export function createToastState() {
    let toasts = $state<Array<Toast>>([])

    function addToast(toast: Omit<Toast, 'key'>) {
        const key = `${Date.now()}-${Math.random()}`
        toasts = [...toasts, { ...toast, key, duration: toast.duration ?? 3 }]
    }

    function removeToast(key: string) {
        toasts = toasts.filter((toast) => toast.key !== key)
    }

    return {
        get toasts() {
            return toasts
        },
        addToast,
        removeToast
    }
}

export type ToastState = ReturnType<typeof createToastState>