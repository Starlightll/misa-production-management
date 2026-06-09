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

interface Filter {
    key: string;
    type: string;
    fieldLabel: string;
    operatorLabel: string;
    operator: string;
    value: any;
}

export function useTablePagingFilter<T>(
    fetchApiFn: (params: PagingParams) => Promise<any>,
    searchColumns: string[] = [],
    localStorageKey: string = 'misaTablePageSize',
    defaultSort: string = '',
    fields: any[] = [],
) {
    // 1. Các State phản ứng quản lý phân trang
    const isLoading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(localStorage.getItem(localStorageKey) || '10');
    const tableRows = ref<T[]>([]); // Sử dụng Generic kiểu <T> đại diện cho Shift, Customer, Employee...
    const totalItems = ref(0);
    const totalPages = ref(0);
    const selectedRowIndices = ref<number[]>([]);
    const selectedItems = ref<string[]>([]); // item ids
    const sortString = ref('');

    const columns = computed(() => {
        return fields.filter(f => f.showInTable && f.exportable).map(f => ({
            key: f.key,
        }));
    });

    const filters = computed(() => {
        console.log("Tính toán filters từ fields:", fields);
        let filtersData: any[] = [];
        fields.forEach(f => {
            if (f.filter?.filterData && f.filter.filterData.value) {
                filtersData.push({
                    key: f.key,
                    type: f.filter.filterType,
                    fieldLabel: f.label,
                    operatorLabel: f.filter.filterData.operatorLabel,
                    operator: f.filter.filterData.operator,
                    value: f.filter.filterData.value,
                });
            }
        });
        return filtersData;
    });

    // const sorts = ref<{ field: any; direction: string }[]>([]);

    // State tìm kiếm và lọc cột
    const searchTerm = ref('');
    // const globalFilterArray = ref<any[]>([]); // Lưu mảng filterBuilder từ Table truyền lên

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
        isLoading.value = true;
        await new Promise(resolve => setTimeout(resolve, 300));
        const params: PagingParams = {
            pageIndex: currentPage.value,
            pageSize: pageSize.value,
            filter: globalFilterArray.value.length > 0 ? JSON.stringify(globalFilterArray.value) : "",
            sort: sortString.value !== '' ? sortString.value : defaultSort || "[{\"Selector\":\"CreatedDate\",\"Desc\":false}]",
            columns: activeFields.length > 0 ? activeFields.join(',') : columns.value.map((c: any) => c.key).join(','),
            customFilter: buildCustomFilter(searchTerm.value),
        };

        console.log("sortString khi loadData:", sortString.value);

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
        } finally {
            isLoading.value = false;
        }
    };

    // 5. Các hàm điều phối Phân trang Điều hướng UI
    const changePageSize = (newSize: string) => {
        pageSize.value = newSize;
        currentPage.value = 1;
        localStorage.setItem(localStorageKey, newSize);
        loadData();
    };

    const nextPage = () => {
        if (!canGoNext.value) return;
        currentPage.value += 1;
        loadData();
    };

    const prevPage = () => {
        if (!canGoPrev.value) return;
        currentPage.value -= 1;
        loadData();
    };

    const goToFirstPage = () => {
        if (!canGoPrev.value) return;
        currentPage.value = 1;
        loadData();
    };

    const goToLastPage = () => {
        if (!canGoNext.value) return;
        currentPage.value = totalPages.value;
        loadData();
    };

    // Debounce Tìm kiếm nhanh
    let searchTimeout: number | null = null;
    const executeSearch = (value: string) => {
        searchTerm.value = value;
        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = window.setTimeout(() => {
            currentPage.value = 1;
            loadData();
        }, 500);
    };

    // Xử lý khi nhận mảng bộ lọc từ Component Table truyền ra
    const handleFilterChange = (filterData: any) => {
        // filterData: field, filterData
        // Update fields trong mảng fields để lưu lại thông tin filterData cho từng cột, giúp giữ trạng thái lọc khi người dùng mở lại filter của cột đó
        fields.forEach(f => {
            if (f.key === filterData.key) {
                f.filter.filterData.operator = filterData.operator;
                f.filter.filterData.value = filterData.value;
                f.filter.filterData.operatorLabel = filterData.operatorLabel;
            }
        });
        console.log("Fields sau khi cập nhật:", fields);
        loadData();
    };

    const handleSortChange = (sortData: string) => {
        console.log("Nhận sortData từ Table:", sortData);
        if (sortData && sortData !== '') {
            sortString.value = sortData;
        } else {
            sortString.value = defaultSort || '';
        }
        loadData();
    }

    const removeFilterFromFilters = (fieldKey: string) => {
        // Xóa filter của cột fieldKey khỏi filters.value
        fields.forEach(f => {
            if (f.key === fieldKey) {
                f.filter.filterData.operator = '';
                f.filter.filterData.value = '';
                f.filter.filterData.operatorLabel = '';
            }
        });
        console.log("Global Filter sau khi xóa filter của cột", fieldKey, ":", globalFilterArray.value);
        currentPage.value = 1;
        loadData();
    }

    const clearAllFilters = () => {
        fields.forEach(f => {
            if (f.filter?.filterData) {
                f.filter.filterData.operator = '';
                f.filter.filterData.value = '';
                f.filter.filterData.operatorLabel = '';
            }
        });
        console.log("Global Filter sau khi xóa tất cả filter:", globalFilterArray.value);
        currentPage.value = 1;
        loadData();
    };

    const globalFilterArray = computed(() => {
        if (!filters.value || filters.value.length === 0) return [];

        const result: any[] = [];

        filters.value.forEach((filter, index) => {
            const key = filter.key.charAt(0).toUpperCase() + filter.key.slice(1);
            const type = filter.type;
            let value = filter.value;

            // --- XỬ LÝ ÉP KIỂU DỮ LIỆU ---
            if (type === 'number' && value !== '') {
                value = Number(value);
            } else if (type === 'select') {
                value = (value === 'true' || value === true);
            } else if (type === 'date' && value) {
                // MỚI: Xử lý Date. Tránh bị lùi ngày do múi giờ khi gọi toISOString()
                if (value instanceof Date) {
                    const offset = value.getTimezoneOffset() * 60000;
                    value = (new Date(value.getTime() - offset)).toISOString().split('T')[0];
                    // Kết quả: "2026-06-04"
                }
            }

            let condition = [];
            if (filter.operator === 'isnull') {
                condition = [[key, "isnull", type], "or", [key, "=", ""]];
            }
            else if (filter.operator === 'isnotnull') {
                condition = [[key, "notnull", type], "and", [key, "<>", ""]];
            }
            else {
                condition = [key, filter.operator, value];
            }

            result.push(condition);
            if (index < filters.value.length - 1) {
                result.push("and");
            }
        });

        return result;
    });


    return {
        isLoading,
        currentPage,
        pageSize,
        tableRows,
        totalItems,
        totalPages,
        selectedRowIndices,
        selectedItems,
        filters,
        searchTerm,
        canGoPrev,
        canGoNext,
        pageStart,
        pageEnd,
        globalFilterArray,
        loadData,
        changePageSize,
        nextPage,
        prevPage,
        goToFirstPage,
        goToLastPage,
        executeSearch,
        handleFilterChange,
        handleSortChange,
        removeFilterFromFilters,
        clearAllFilters,
    };
}