import { ref, computed } from 'vue';

// Định nghĩa Interface cấu trúc tham số Paging chuẩn của dự án MISA
interface PagingParams {
    pageIndex: number;
    pageSize: string;
    filter: string;
    sort: string;
    columns: string;
    customFilter: string;
}


export function useTablePagingFilter<T>(
    fetchApiFn: (params: PagingParams) => Promise<any>,
    searchColumns: string[] = [],
    localStorageKey: string = 'misaTablePageSize',
    defaultSort: string = ''
) {
    // 1. Các State phản ứng quản lý phân trang
    const currentPage = ref(1);
    const pageSize = ref(localStorage.getItem(localStorageKey) || '10');
    const tableRows = ref<T[]>([]); // Sử dụng Generic kiểu <T> đại diện cho Shift, Customer, Employee...
    const totalItems = ref(0);
    const totalPages = ref(0);
    const selectedRowIndices = ref<number[]>([]);

    // State tìm kiếm và lọc cột
    const searchTerm = ref('');
    const globalFilterArray = ref<any[]>([]); // Lưu mảng filterBuilder từ Table truyền lên

    // 2. Các biến Computed bổ trợ UI phân trang
    const pageSizeNumber = computed(() => Number(pageSize.value) || 0);
    const canGoPrev = computed(() => currentPage.value > 1);
    const canGoNext = computed(() => totalPages.value > 0 && currentPage.value < totalPages.value);

    // Tính toán Start/End dựa trực tiếp vào số lượng phần tử thực tế đang có trong `tableRows` của trang đó
    const pageStart = computed(() => {
        if (totalItems.value === 0 || tableRows.value.length === 0 || pageSizeNumber.value === 0) return 0;
        return (currentPage.value - 1) * pageSizeNumber.value + 1;
    });

    const pageEnd = computed(() => {
        if (totalItems.value === 0 || tableRows.value.length === 0 || pageSizeNumber.value === 0) return 0;
        // Lấy số bắt đầu của trang hiện tại cộng với số lượng dòng thực tế đang hiển thị trên lưới
        return (currentPage.value - 1) * pageSizeNumber.value + tableRows.value.length;
    });

    // 3. Logic xây dựng Custom Filter tìm kiếm nhanh theo cột chỉ định
    const buildCustomFilter = (term: string) => {
        if (!term || searchColumns.length === 0) return '';

        const result: any[] = [];
        searchColumns.forEach((col, index) => {
            result.push([col, "contains", term]);
            if (index < searchColumns.length - 1) {
                result.push("or");
            }
        });
        return JSON.stringify(result);
    };

    // 4. Hàm THẦN CHÚ: Tổng hợp tất cả State để gọi API
    const loadData = async (activeFields: string[] = []) => {
        const params: PagingParams = {
            pageIndex: currentPage.value,
            pageSize: pageSize.value,
            filter: globalFilterArray.value.length > 0 ? JSON.stringify(globalFilterArray.value) : "",
            sort: defaultSort || "[{\"Selector\":\"CreatedDate\",\"Desc\":true}]",
            columns: activeFields.length > 0 ? activeFields.join(',') : "",
            customFilter: buildCustomFilter(searchTerm.value),
        };

        try {
            const response = await fetchApiFn(params);
            if (response && response.data) {
                tableRows.value = response.data.data || [];
                totalItems.value = response.data.total || 0;
                totalPages.value = response.data.totalPages || 0;
                selectedRowIndices.value = []; // Reset tích chọn dòng sau khi reload dữ liệu
            }
        } catch (error) {
            console.error('Lỗi nạp dữ liệu phân trang công cục:', error);
        }
    };

    // 5. Các hàm điều phối Phân trang Điều hướng UI
    const changePageSize = (newSize: string, activeFields: string[] = []) => {
        pageSize.value = newSize;
        currentPage.value = 1;
        localStorage.setItem(localStorageKey, newSize);
        loadData(activeFields);
    };

    const nextPage = (activeFields: string[] = []) => {
        if (!canGoNext.value) return;
        currentPage.value += 1;
        loadData(activeFields);
    };

    const prevPage = (activeFields: string[] = []) => {
        if (!canGoPrev.value) return;
        currentPage.value -= 1;
        loadData(activeFields);
    };

    const goToFirstPage = (activeFields: string[] = []) => {
        if (!canGoPrev.value) return;
        currentPage.value = 1;
        loadData(activeFields);
    };

    const goToLastPage = (activeFields: string[] = []) => {
        if (!canGoNext.value) return;
        currentPage.value = totalPages.value;
        loadData(activeFields);
    };

    // Debounce Tìm kiếm nhanh
    let searchTimeout: number | null = null;
    const executeSearch = (value: string, activeFields: string[] = []) => {
        searchTerm.value = value;
        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = window.setTimeout(() => {
            currentPage.value = 1;
            loadData(activeFields);
        }, 500);
    };

    // Xử lý khi nhận mảng bộ lọc từ Component Table truyền ra
    const handleFilterChange = (filterArray: any[], activeFields: string[] = []) => {
        globalFilterArray.value = filterArray;
        currentPage.value = 1;
        loadData(activeFields);
    };

    return {
        currentPage,
        pageSize,
        tableRows,
        totalItems,
        totalPages,
        selectedRowIndices,
        searchTerm,
        canGoPrev,
        canGoNext,
        pageStart,
        pageEnd,
        loadData,
        changePageSize,
        nextPage,
        prevPage,
        goToFirstPage,
        goToLastPage,
        executeSearch,
        handleFilterChange
    };
}