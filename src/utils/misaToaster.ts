export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastPayload {
    title: string;
    message: string;
    type?: ToastType;
    duration?: number;
}

export function showToast(
    title: string,
    message: string,
    type: ToastType = "success",
    duration = 6000
) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent<ToastPayload>("misa:toast", {
            detail: { title, message, type, duration },
        })
    );
}
