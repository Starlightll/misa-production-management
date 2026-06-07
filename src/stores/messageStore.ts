import { defineStore } from 'pinia';
import { ref } from 'vue';

interface MessageOptions {
    icon?: string;
    title: string;
    message: string;
    variant?: 'info' | 'warning' | 'danger';
    acceptText?: string; // Tùy chỉnh text cho nút xác nhận
    cancelText?: string; // Tùy chỉnh text cho nút hủy
    onAccept?: () => void | Promise<void>;
    onCancel?: () => void;
}

export const useMessageStore = defineStore('message', () => {
    // 1. Các State điều khiển Modal
    const isVisible = ref(false);
    const icon = ref('');
    const title = ref('');
    const message = ref('');
    const variant = ref<'info' | 'warning' | 'danger'>('info');
    const acceptText = ref('Đồng ý');
    const cancelText = ref('Hủy');

    // Lưu trữ các hàm callback ngầm khi người dùng bấm nút
    const resolveCallback = ref<((value: boolean) => void) | null>(null);
    const onAcceptCallback = ref<(() => void | Promise<void>) | null>(null);
    const onCancelCallback = ref<(() => void) | null>(null);

    // 2. Hàm kích hoạt hiển thị Modal từ bất cứ đâu
    const open = (options: MessageOptions) => {
        icon.value = options.icon || '';
        title.value = options.title;
        message.value = options.message;
        variant.value = options.variant || 'info';
        acceptText.value = options.acceptText || 'Đồng ý';
        cancelText.value = options.cancelText || 'Hủy';
        onAcceptCallback.value = options.onAccept || null;
        onCancelCallback.value = options.onCancel || null;

        isVisible.value = true;

        // Trả về một Promise để có thể sử dụng cú pháp async/await ở component nếu muốn
        return new Promise<boolean>((resolve) => {
            resolveCallback.value = resolve;
        });
    };

    // 3. Hàm xử lý khi người dùng nhấn "Đồng ý / Xác nhận"
    const accept = async () => {
        if (onAcceptCallback.value) {
            await onAcceptCallback.value();
        }
        if (resolveCallback.value) resolveCallback.value(true);
        close();
    };

    // 4. Hàm xử lý khi người dùng nhấn "Hủy / Đóng"
    const cancel = () => {
        if (onCancelCallback.value) {
            onCancelCallback.value();
        }
        if (resolveCallback.value) resolveCallback.value(false);
        close();
    };

    // Hàm đóng và reset trạng thái
    const close = () => {
        isVisible.value = false;
    };

    return {
        isVisible,
        icon,
        title,
        message,
        variant,
        acceptText,
        cancelText,
        open,
        accept,
        cancel,
        close
    };
});