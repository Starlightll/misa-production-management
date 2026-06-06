import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// 1. Khởi tạo instance của Axios với cấu hình cơ bản
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.API_URL || 'https://localhost:7243',
    timeout: 10000, // 10 giây đóng kết nối nếu server không phản hồi
    headers: {
        'Content-Type': 'application/json',
    },
});


// 2. Request Interceptor: Chạy trước khi request được gửi lên server
// apiClient.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         // Ví dụ lấy token từ localStorage để đính kèm vào Header nếu hệ thống có Auth
//         const token = localStorage.getItem('accessToken');
//         if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );


// 3. Response Interceptor: Chạy ngay sau khi nhận kết quả từ server trả về
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Tự động giải nén dữ liệu, loại bỏ lớp bọc bên ngoài của axios
        // Từ giờ bạn không cần phải response.data ở component nữa
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung tại đây
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 401:
                    console.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
                    // Ví dụ: router.push('/login')
                    break;
                case 403:
                    console.error('Bạn không có quyền thực hiện hành động này.');
                    break;
                case 400:
                    console.error('Dữ liệu gửi lên không hợp lệ:', data?.message || error.message);
                    break;
                case 500:
                    console.error('Lỗi hệ thống từ phía Server. Vui lòng thử lại sau.');
                    break;
                default:
                    console.error(`Lỗi hệ thống (${status}):`, data?.message || error.message);
            }
        } else if (error.request) {
            // Lỗi khi gửi request nhưng không nhận được phản hồi (rớt mạng, server sập...)
            console.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền internet.');
        } else {
            console.error('Đã xảy ra lỗi:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;