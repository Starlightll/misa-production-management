import apiClient from './apiClient';
import type { Shift } from '../types/Shift';


// Định nghĩa kiểu dữ liệu cho Params phân trang gửi lên
interface PagingParams {
    pageIndex: number;
    pageSize: string;
    filter: string;
    sort: string;
    columns: string;
    customFilter: string;
}

// Định nghĩa cấu trúc kết quả trả về từ Backend MISA của bạn
interface ApiResponse<T> {
    success: boolean;
    data: {
        data: T[];
        total: number;
        totalPages: number;
    };
    message?: string;
}

interface ExportExcelParams {
    fileName: string;
    columns: any[];
    customFilter: string;
    filter: string;
    sort: string;
}

export const shiftService = {
    /**
     * Lấy danh sách ca làm việc phân trang, bộ lọc
     */
    getDataPaging(params: PagingParams): Promise<ApiResponse<Shift>> {
        return apiClient.post('/api/Shifts/dataPaging', params);
    },

    /**
     * Lấy thông tin chi tiết ca làm việc theo ID
     */
    getById(id: string): Promise<any> {
        return apiClient.get(`/api/Shifts/${id}`);
    },

    /**
     * Thêm mới ca làm việc
     */
    create(data: Partial<Shift>): Promise<any> {
        return apiClient.post('/api/Shifts', data);
    },

    /**
     * Cập nhật thông tin ca làm việc
     */
    update(id: string, data: Partial<Shift>): Promise<any> {
        return apiClient.put(`/api/Shifts/${id}`, data);
    },

    /**
     * Xóa hàng loạt ca làm việc
     */
    bulkDelete(ids: string[]): Promise<any> {
        return apiClient.delete('/api/Shifts/bulk-delete', { data: ids });
    },

    /**
     * Cập nhật trạng thái ngừng sử dụng/sử dụng
     */
    updateStatus(payload: { shiftIds: string[]; inactive: boolean }): Promise<any> {
        return apiClient.put('/api/Shifts/update-inactive', payload);
    },

    /**
     * Xuất khẩu dữ liệu excel
     */
    exportExcel(params: ExportExcelParams): Promise<Blob> {
        return apiClient.post('/api/Shifts/export-excel', {
            params,
            responseType: 'blob' // Đảm bảo nhận về file dưới dạng Blob
        });
    }
};