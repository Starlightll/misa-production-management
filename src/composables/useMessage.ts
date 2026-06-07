import { useMessageStore } from '../stores/messageStore';

export function useMessage() {
    const messageStore = useMessageStore();

    return {
        /**
         * Hiển thị hộp thoại xác nhận công khai
         */
        show: messageStore.open,
        /**
         * Đóng hộp thoại xác nhận thủ công nếu cần
         */
        close: messageStore.close
    };
}