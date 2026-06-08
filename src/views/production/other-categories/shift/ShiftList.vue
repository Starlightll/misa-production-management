<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import MsTableDefault from '../../../../components/base/ms-table/MsTableDefault.vue';
import { shiftService } from '../../../../api/shiftService.ts';
import { useMessage } from '../../../../composables/useMessage.ts';
import { useTablePagingFilter } from '../../../../composables/useTablePagingFilter';
import { toast } from 'vue3-toastify';

const message = useMessage();

const fields = ref([
    {
        index: 0,
        showInTable: true,
        key: "Checkbox",
        label: "",
        type: "custom",
        width: '50px',
        fixed: "left",
        sortable: false,
        filterable: false,
        resizable: false,
        movable: false,
        exportable: false,
        print: false,
        style: {
            position: "sticky",
            left: 0,
            zIndex: 5,
            width: '50px',
            minWidth: "50px",
            maxWidth: "50px",
        },
    },
    {
        key: 'shiftCode', label: 'Mã ca', type: "text", resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "text",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '120px',
        },
    },
    {
        key: 'shiftName', label: 'Tên ca', type: "text", resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "text",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '250px',
        },
    },
    {
        key: 'shiftBeginTime', label: 'Giờ vào ca', type: 'time', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        pinned: true,
        style: {
            width: '130px',
        },
    },
    {
        key: 'shiftEndTime', label: 'Giờ hết ca', type: 'time', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        style: {
            width: '130px',
        },
    },
    {
        key: 'shiftBeginBreakTime', label: 'Bắt đầu nghỉ giữa ca', type: 'time', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        style: {
            width: '200px',
        },
    },
    {
        key: 'shiftEndBreakTime', label: 'Kết thúc nghỉ giữa ca', type: 'time', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        style: {
            width: '210px',
        },
    },
    {
        key: 'shiftWorkingTime', label: 'Thời gian làm việc (giờ)', type: 'number', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "number",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '210px',
        },
    },
    {
        key: 'shiftBreakingTime', label: 'Thời gian nghỉ giữa ca (giờ)', type: 'number', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "number",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '230px',
        },
    },
    {
        key: 'shiftInactive', label: 'Trạng thái', type: 'custom', resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "select",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
            filterOptions: [
                { label: 'Ngừng sử dụng', value: 'true' },
                { label: 'Đang sử dụng', value: 'false' },
            ],
        },
        style: {
            width: '230px',
        },
    },
    {
        key: 'createdBy', label: 'Người tạo', type: "text", resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "text",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '200px',
        },
    },
    {
        key: 'createdDate', label: 'Ngày tạo', type: "date", resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "date",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '160px',
        },
    },
    {
        key: 'modifiedBy', label: 'Người sửa', type: "text", resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "text",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '160px',
        },
    },
    {
        key: 'modifiedDate', label: 'Ngày sửa', type: "date", resizable: true,
        movable: true,
        showInTable: true,
        exportable: true,
        sortable: true,
        filter: {
            filterable: true,
            filterType: "date",
            filterData: {
                operatorLabel: '',
                operator: '',
                value: '',
            },
        },
        style: {
            width: '160px',
        },
    },
    {
        index: 17,
        showInTable: true,
        key: "Action",
        label: "Hành động",
        type: "custom",
        fixed: "right",
        sortable: false,
        filterable: false,
        resizable: false,
        exportable: false,
        movable: false,
        displayOnHover: true,
        style: {
            position: "sticky",
            right: 0,
            zIndex: 10,
            overflow: 'visible',
            width: '120px',
            borderLeft: 'none',
        },
        contentStyle: {
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
        },
    },
]);


const searchColumns = ['ShiftCode', 'ShiftName', 'CreatedBy', 'ModifiedBy'];
// 2. Kích hoạt Composable Generic, định nghĩa rõ ràng kiểu dữ liệu là thực thể <Shift>
const {
    currentPage,
    pageSize,
    tableRows,
    totalItems,
    selectedRowIndices,
    canGoPrev,
    canGoNext,
    pageStart,
    pageEnd,
    filters,
    globalFilterArray,
    loadData,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
    executeSearch,
    handleFilterChange,
    handleSortChange,
    removeFilterFromFilters,
    clearAllFilters,
} = useTablePagingFilter<Shift>(
    shiftService.getDataPaging, // Truyền trực tiếp hàm gọi API từ lớp Service lớp trước
    searchColumns,
    'shiftTablePageSize',
    '[{"Selector":"ShiftCode","Desc":false}]',
    fields.value, // Truyền mảng cấu hình cột để Composable có thể tự động build filter
);

const activeColumnKeys = computed(() => fields.value.filter(f => f.exportable && f.showInTable).map(f => f.key));

//#region init data ==================================================================================
// const fetchDataPaging = async (pagingParams: PagingParams) => {
//     pagingParams.filter = filterBuilder();

//     const params = {
//         pageIndex: pagingParams.page,
//         pageSize: pagingParams.pageSize,
//         filter: pagingParams.filter && pagingParams.filter.length > 0 ? JSON.stringify(pagingParams.filter) : "",
//         sort: pagingParams.sort && pagingParams.sort.length > 0 ? JSON.stringify(pagingParams.sort) : "[{\"Selector\":\"ShiftCode\",\"DESC\":false}]",
//         columns: pagingParams.columns && pagingParams.columns.length > 0 ? pagingParams.columns.join(',') : "",
//         customFilter: pagingParams.customFilter && pagingParams.customFilter.length > 0 ? JSON.stringify(pagingParams.customFilter) : "",
//     };
//     try {
//         const response = await shiftService.getDataPaging(params);
//         tableRows.value = response.data.data;
//         totalItems.value = response.data.total;
//         totalPages.value = response.data.totalPages;
//         selectedRowIndices.value = [];
//     } catch (error) {
//     }

// }
//#endregion ========================================================================================

//#region api call ==================================================================================
const deleteShift = async (shiftIds: string[]) => {
    let messageContent = '';
    if (shiftIds.length === 1) {
        const shift = tableRows.value.find(r => r.shiftId === shiftIds[0]);
        messageContent = /* html */ `<span>Ca làm việc <span class="font-semibold">${shift?.shiftCode}</span> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?</span>`;
    } else {
        messageContent = /* html */ `<span>Các <span class="font-semibold">Ca làm việc</span> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?</span>`;
    }
    message.show({
        icon: "mi-qtsx icon-warning bg-(--color-warning)!",
        title: "Xóa Ca làm việc",
        variant: "danger",
        acceptText: "Xóa",
        message: messageContent,
        onAccept: async () => {
            try {
                const response = await shiftService.bulkDelete(shiftIds);
                if (response.isSuccess) {
                    toast.success(response.message || "Xóa thành công!");
                    // fetchDataPaging(pagingParams.value);
                    //Xóa dòng trong bảng mà không cần gọi lại API
                    tableRows.value = tableRows.value.filter(r => !shiftIds.includes(r.shiftId));
                    totalItems.value -= shiftIds.length; // Cập nhật lại tổng số items sau khi xóa
                    //Reset selected rows
                    selectedRowIndices.value = [];
                    console.log("Xóa thành công!");
                    // if (tableRows.value.length === 0 && currentPage.value > 1) {
                    //     prevPage(activeColumnKeys.value);
                    // }
                    if (tableRows.value.length === 0) {
                        if (currentPage.value > 1) {
                            // Nếu ở trang 2, 3, 4... thì lùi về trang trước (hàm prevPage sẽ tự gọi loadData)
                            prevPage(activeColumnKeys.value);
                        } else if (totalItems.value > 0) {
                            // Nếu đang ở TRANG ĐẦU TIÊN, nhưng tổng số items vẫn > 0 (tức là vẫn còn dòng ở các trang sau)
                            // Ta giữ nguyên currentPage = 1 và gọi loadData() để kéo dữ liệu trang sau gối đầu lên trang 1
                            await loadData(activeColumnKeys.value);
                        }
                        // Trường hợp cuối cùng: currentPage === 1 và totalItems === 0 nghĩa là hệ thống hết sạch dữ liệu,
                        // UI tự động hiển thị bảng trống đúng thực tế, không cần gọi API nữa.
                    }
                } else {
                    toast.error(response.message || "Xóa thất bại. Vui lòng thử lại sau.");
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            }
        }
    });

    // confirmModalType.value = "warning";
    // isConfirmModalVisible.value = true;
    // confirmModalAction.value = async () => {
    //     // Call API to delete shifts
    //     try {
    //         await shiftService.bulkDelete(shiftIds);
    //         fetchDataPaging(pagingParams.value);
    //     } catch (error) {
    //         console.error('Error deleting shifts:', error);
    //     }
    // };
};

const updateShiftStatus = async (shiftIds: string[], inactive: boolean) => {
    console.log(`${inactive ? 'Deactivate' : 'Activate'} shifts with IDs:`, shiftIds);
    try {
        const payload = {
            shiftIds,
            inactive,
        };
        const response = await shiftService.updateStatus(payload);
        if (response.isSuccess) {
            toast.success(response.message || "Cập nhật trạng thái thành công!");
            //update status in table without call API again
            tableRows.value = tableRows.value.map(r => {
                if (shiftIds.includes(r.shiftId)) {
                    return {
                        ...r,
                        shiftInactive: inactive,
                    };
                }
                return r;
            });
            // fetchDataPaging(pagingParams.value);
        } else {
            toast.error(response.message || "Cập nhật trạng thái thất bại. Vui lòng thử lại sau.");
        }

    } catch (error) {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        console.error(`Error ${inactive ? 'deactivating' : 'activating'} shifts:`, error);
    }
};
//#endregion =================================================================================


//#region shift detail modal action
const shiftDetailModalRef = ref<any>(null);

const openShiftDetailModal = (shiftId: string, state: "add" | "edit" | "duplicate", originalData?: any) => {
    console.log('Opening Shift Detail Modal with ID:', shiftId, 'State:', state);
    if (shiftDetailModalRef.value) {
        shiftDetailModalRef.value.showModal(state, shiftId, originalData);
    }
};

//#endregion

const handleSaved = (response: any) => {
    console.log('Shift saved successfully. Response:', response.data);
    if (response) {
        const savedShift = response.data;
        const index = tableRows.value.findIndex(r => r.shiftId === savedShift.shiftId);
        if (index !== -1) {
            toast.success("Cập nhật ca làm việc thành công!");
            tableRows.value[index] = savedShift;
        } else {
            toast.success("Thêm mới ca làm việc thành công!");
            tableRows.value.unshift(savedShift);
            totalItems.value += 1;
            console.log('Total items after adding new shift:', totalItems.value);
        }
    }
}


//#region confirm modal state
const isConfirmModalVisible = ref(false);
const confirmModalVariant = ref<"info" | "warning" | "danger">("info");
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmModalType = ref("info");
const confirmModalAction = ref<(() => void) | null>(null);
const closeConfirmModalAction = ref<(() => void) | null>(null);

//#endregion


import type { Shift } from '../../../../types/Shift.ts';
import MsMessage from '../../../../components/base/ms-modal/MsMessage.vue';
import ShiftDetailModal from './components/ShiftDetailModal.vue';
import TableDisplaySettings from '../../../../components/base/ms-table/components/TableDisplaySettings.vue';
//#region table settings 
// Table settings
const dataColumns = computed(() => {
    return fields.value.filter(f => f.exportable && f.showInTable).map(f => {
        return {
            Key: f.key,
            DisplayName: f.label,
        };
    });
});

// const currentPage = ref(1);
// const pageSize = ref(localStorage.getItem('shiftTablePageSize') || '10');
// const tableRows = ref<Shift[]>([]);
// const totalItems = ref(0);
// const totalPages = ref(0);
const pageSizeOptions = [
    {
        label: '10',
        value: '10',
    }, {
        label: '20',
        value: '20',
    }, {
        label: '50',
        value: '50',
    }, {
        label: '100',
        value: '100',
    }
];



// const filter = ref<string[]>([]);
// const sort = ref<string[]>([]);
// const columns = ref<string[]>([]);
// const customFilter = ref<string[]>([]);

// type PagingParams = {
//     page: number;
//     pageSize: string;
//     filter: string[];
//     sort: string[];
//     columns: string[];
//     customFilter: string[];
// };

// const pagingParams = computed<PagingParams>(() => ({
//     page: currentPage.value,
//     pageSize: pageSize.value,
//     filter: filter.value,
//     sort: sort.value,
//     columns: dataColumns.value.map(c => c.Key),
//     customFilter: customFilter.value,
// }));

// const changePageSize = (newSize: string) => {
//     pageSize.value = newSize;
//     currentPage.value = 1;
//     localStorage.setItem('shiftTablePageSize', newSize);
//     fetchDataPaging(pagingParams.value);
// };

// const nextPage = () => {
//     if (!canGoNext.value) {
//         return;
//     }
//     currentPage.value += 1;
//     fetchDataPaging(pagingParams.value);
// };

// const prevPage = () => {
//     if (!canGoPrev.value) {
//         return;
//     }
//     currentPage.value -= 1;
//     fetchDataPaging(pagingParams.value);
// };

// const goToPage = (page: number) => {
//     if (totalPages.value === 0) {
//         return;
//     }
//     const next = Math.min(Math.max(page, 1), totalPages.value);
//     currentPage.value = next;
//     fetchDataPaging(pagingParams.value);
// };

// const goToFirstPage = () => {
//     if (!canGoPrev.value) {
//         return;
//     }
//     currentPage.value = 1;
//     fetchDataPaging(pagingParams.value);
// };

// const goToLastPage = () => {
//     if (!canGoNext.value) {
//         return;
//     }
//     currentPage.value = totalPages.value;
//     fetchDataPaging(pagingParams.value);
// };

// const pageSizeNumber = computed(() => Number(pageSize.value) || 0);
// const canGoPrev = computed(() => currentPage.value > 1);
// const canGoNext = computed(() => totalPages.value > 0 && currentPage.value < totalPages.value);
// const pageStart = computed(() => {
//     if (totalItems.value === 0 || pageSizeNumber.value === 0) {
//         return 0;
//     }
//     return (currentPage.value - 1) * pageSizeNumber.value + 1;
// });
// const pageEnd = computed(() => {
//     if (totalItems.value === 0 || pageSizeNumber.value === 0) {
//         return 0;
//     }
//     return Math.min(currentPage.value * pageSizeNumber.value, totalItems.value);
// });

//#endregion

//#region Search debounce
// const searchTimeout = ref<number | null>(null);
// const onSearchInput = (value: string) => {
//     console.log('Search input:', value);
//     searchTerm.value = value;
//     if (searchTimeout.value) {
//         clearTimeout(searchTimeout.value);
//     }
//     searchTimeout.value = window.setTimeout(() => {
//         customFilter.value = buildCustomFilter(searchTerm.value) as unknown as string[];
//         currentPage.value = 1;
//         // fetchDataPaging(pagingParams.value);
//     }, 500);
// };
//#endregion

//#region search

const searchTerm = ref('');

//Build custom filter string array for search follow format [["ShiftCode","contains","abc"],"or",["ShiftName","contains","abc"],"or",["CreatedBy","contains","abc"],"or",["ModifiedBy","contains","abc"]]
const buildCustomFilter = (searchTerm: string) => {
    return [
        ["ShiftCode", "contains", searchTerm],
        "or",
        ["ShiftName", "contains", searchTerm],
        "or",
        ["CreatedBy", "contains", searchTerm],
        "or",
        ["ModifiedBy", "contains", searchTerm]
    ];

};
//#endregion


const showMenuId = ref<string | null>(null);
const toggleMenu = (rowId: string, rowIndex: number) => {
    console.log('Toggling menu for row ID:', rowId, 'at index:', rowIndex);
    focusedRowIndex.value = rowIndex;
    showMenuId.value = showMenuId.value === rowId ? null : rowId;
};
const focusedRowIndex = ref<number>(-1);

const closeMenu = () => {
    showMenuId.value = null;
};

// const handleDocumentClick = () => {
//     closeMenu();
// };

//#region validate



//#region add/edit modal




const handleDuplicateShift = (shiftId: string) => {
    const shift = tableRows.value.find((r) => r.shiftId === shiftId);
    openShiftDetailModal(shiftId, 'duplicate', shift);
};

// const closeAddEditShiftModal = (checkUnsaved = true) => {
//     //Check if form before edit data is different with current form data, if different show confirm modal
//     if (!checkUnsaved) {
//         //Delay to ensure modal close animation is smooth before resetting form data
//         setTimeout(() => {
//             resetFormShiftData();
//         }, 300);
//         return;
//     }
//     const isDataChanged = JSON.stringify(formShiftData.value) !== JSON.stringify(formShiftBeforeEditData.value);
//     if (isDataChanged) {
//         console.log('Data has been changed. Showing confirm modal before closing.');
//         confirmModalVariant.value = 'info';
//         confirmModalTitle.value = 'Thoát và không lưu?';
//         confirmModalMessage.value = 'Nếu bạn thoát, các dữ liệu đang nhập liệu sẽ không được lưu lại.';
//         isConfirmModalVisible.value = true;
//         confirmModalAction.value = () => {
//             isConfirmModalVisible.value = false;
//             //Delay to ensure modal close animation is smooth before resetting form data
//             setTimeout(() => {
//                 resetFormShiftData();
//             }, 300);
//         };
//     } else {
//         //Delay to ensure modal close animation is smooth before resetting form data
//         setTimeout(() => {
//             resetFormShiftData();
//         }, 300);
//     }

//     // isAddEditShiftModalVisible.value = false;
//     // //Delay to ensure modal close animation is smooth before resetting form data
//     // setTimeout(() => {
//     //     resetFormShiftData();
//     // }, 300);
// };


// Convert time fields to HH:mm:ss format if they are not already


//#endregion

//#region selected rows
//test selectedRowIndices 0 1 2 3
// const selectedRowIndices = ref<number[]>([]);
const selectedShift = computed(() => {
    return selectedRowIndices.value.map(index => tableRows.value[index]);
});

const handleSelectRow = (row: Shift) => {
    const index = tableRows.value.findIndex(r => r.shiftId === row.shiftId);
    if (index === -1) return;

    const selectedIndex = selectedRowIndices.value.indexOf(index);
    if (selectedIndex === -1) {
        selectedRowIndices.value.push(index);
    } else {
        selectedRowIndices.value.splice(selectedIndex, 1);
    }
};

const handleSelectAll = () => {
    if (selectedRowIndices.value.length === tableRows.value.length) {
        selectedRowIndices.value = [];
    } else {
        selectedRowIndices.value = tableRows.value.map((_, index) => index);
    }
};

//#endregion

//#region delete and update status for selected rows

//#endregion




//#region filter logic
// const filterModalRef = ref<any>(null);
// const filterModalVisible = ref(false);
// const filterModalPosition = ref({ top: '0px', left: '0px', width: `${0}px` });
// const currentFilterField = ref<any>(null);
// const filterModalWidth = 350;
// const filterMessage = ref('');

// biến lưu các lựa chọn filter của từng cột gồm {key, operator, value} ví dụ {key: "shiftCode", operator: "contains", value: "ca"}
// const columnFilters = ref<{
//     key: string;
//     type: string;
//     fieldLabel: string;
//     operatorLabel: string;
//     operator: string;
//     value: any;
// }[]>([]);



// const clearFilterData = () => {
//     textFilterData.value = {
//         operator: 'contains',
//         value: '',
//     };
//     numberFilterData.value = {
//         operator: '=',
//         value: '',
//     };
//     dateFilterData.value = {
//         operator: '=',
//         value: '',
//     };
//     selectFilterData.value = {
//         operator: '=',
//         value: '',
//     };
// };

// Các tùy chọn filter cho từng loại dữ liệu



// const filterBuilder = () => {
//     if (!columnFilters.value || columnFilters.value.length === 0) return [];

//     const result: any[] = [];

//     columnFilters.value.forEach((filter, index) => {
//         const key = filter.key.charAt(0).toUpperCase() + filter.key.slice(1);
//         const type = filter.type;
//         let value = filter.value;

//         // --- XỬ LÝ ÉP KIỂU DỮ LIỆU ---
//         if (type === 'number' && value !== '') {
//             value = Number(value);
//         } else if (type === 'select') {
//             value = (value === 'true' || value === true);
//         } else if (type === 'date' && value) {
//             // MỚI: Xử lý Date. Tránh bị lùi ngày do múi giờ khi gọi toISOString()
//             if (value instanceof Date) {
//                 const offset = value.getTimezoneOffset() * 60000;
//                 value = (new Date(value.getTime() - offset)).toISOString().split('T')[0];
//                 // Kết quả: "2026-06-04"
//             }
//         }

//         let condition = [];
//         if (filter.operator === 'isnull') {
//             condition = [[key, "isnull", type], "or", [key, "=", ""]];
//         }
//         else if (filter.operator === 'isnotnull') {
//             condition = [[key, "notnull", type], "and", [key, "<>", ""]];
//         }
//         else {
//             condition = [key, filter.operator, value];
//         }

//         result.push(condition);
//         if (index < columnFilters.value.length - 1) {
//             result.push("and");
//         }
//     });

//     return result;
// };


// const removeFilterFromColumnFilters = async (fieldKey: string) => {
//     const index = columnFilters.value.findIndex((f) => f.key === fieldKey);
//     if (index !== -1) {
//         const field = fields.find((f) => f.key === fieldKey);
//         if (field?.filter?.filterData) {
//             field.filter.filterData = {
//                 operatorLabel: '',
//                 operator: '',
//                 value: '',
//             };
//         }
//         columnFilters.value.splice(index, 1);

//     }

//     // await fetchDataPaging(pagingParams.value);
// };



// const clearAllFilters = async () => {
//     // Duyệt qua tất cả các field để xóa filter
//     fields.forEach((field) => {
//         if (field.filter?.filterData) {
//             field.filter.filterData.operator = '';
//             field.filter.filterData.value = '';
//             field.filter.filterData.operatorLabel = '';
//         }
//     });
//     // Xóa tất cả filter khỏi columnFilters
//     columnFilters.value = [];
//     // clearFilterData();
//     // await fetchDataPaging(pagingParams.value);
// };


// const closeFilterModal = () => {
//     filterModalVisible.value = false;
//     currentFilterField.value = null;
//     filterMessage.value = '';
// };

// Khai báo biến lưu bộ đếm thời gian
let closeTimer: ReturnType<typeof setTimeout> | null = null;

// Hàm hủy đếm ngược (Giữ modal mở)
const clearCloseTimer = () => {
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
};

// const closeOnScroll = (event: Event) => {
//     // Nếu modal đang không mở, không cần làm gì cả
//     if (!filterModalVisible.value) return;

//     // Lấy ra phần tử DOM đang xảy ra hành động cuộn
//     const target = event.target as Node;

//     // Nếu phần tử đang cuộn LÀ modal, hoặc NẰM BÊN TRONG modal -> BỎ QUA
//     if (filterModalRef.value && filterModalRef.value.contains(target)) {
//         return;
//     }

//     closeFilterModal();
// };

// Hàm bắt đầu đếm ngược 500ms để đóng Modal


// const showFilterModal = (payload: { field: any, event: MouseEvent }) => {
//     // clearCloseTimer();
//     // // 1. Lấy thẻ HTML vừa được click
//     // const targetEl = payload.event.currentTarget as HTMLElement;
//     // const viewportWidth = window.innerWidth;

//     // // 2. Lấy bộ tọa độ của thẻ đó trên màn hình (Viewport)
//     // const rect = targetEl.getBoundingClientRect();

//     // // 3. Tính toán vị trí cho Modal (Ví dụ cho Modal hiện ngay dưới nút filter)
//     // let modalTop = rect.bottom + 4; // Cách viền dưới nút 4px
//     // let modalLeft = rect.left - (filterModalWidth - rect.width) / 2; // Cố gắng căn giữa Modal với nút

//     // if (modalLeft + filterModalWidth > viewportWidth - 10) {
//     //     // Lật Modal sang trái: Ép mép phải của Modal bằng với mép phải của Icon
//     //     modalLeft = rect.right - filterModalWidth;
//     // }

//     // // Lưu vào biến state để bind vào style của Modal
//     // filterModalPosition.value = {
//     //     top: `${modalTop}px`,
//     //     left: `${modalLeft}px`,
//     //     width: `${filterModalWidth}px`,
//     // };

//     // // Lưu thông tin field để biết đang filter cột nào
//     // currentFilterField.value = payload.field;
//     // // Duyệt columnFilters để tìm xem cột này đã có filter nào được áp dụng chưa, nếu có thì set giá trị đó vào các biến filterData để hiển thị trong Modal
//     // const existingFilter = columnFilters.value.find(f => f.key === payload.field.key);
//     // if (existingFilter) {
//     //     if (currentFilterField.value.filterType === 'number') {
//     //         numberFilterData.value.operator = existingFilter.operator;
//     //         numberFilterData.value.value = existingFilter.value;
//     //     } else if (currentFilterField.value.filterType === 'date') {
//     //         dateFilterData.value.operator = existingFilter.operator;
//     //         dateFilterData.value.value = existingFilter.value;
//     //     } else if (currentFilterField.value.filterType === 'select') {
//     //         selectFilterData.value.operator = existingFilter.operator;
//     //         selectFilterData.value.value = existingFilter.value;
//     //     } else {
//     //         textFilterData.value.operator = existingFilter.operator;
//     //         textFilterData.value.value = existingFilter.value;
//     //     }
//     // } else {
//     //     clearFilterData();
//     // }
//     // filterModalVisible.value = true;
// };


// onClickOutside(filterModalRef, (event) => {
//     closeFilterModal();
// });

const getDisplayValue = (filter: any) => {
    console.log('Getting display value for filter:', filter);
    if (filter.type === 'select' || filter.operator === 'isnull' || filter.operator === 'isnotnull') {
        return '';
    }
    if (filter.type === 'number') {
        if (filter.value == null || filter.value === '') return '';

        const num = Number(filter.value);
        if (!isNaN(num)) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            }).format(num);
        }
    }
    return filter.value;
};
//#endregion


//#region export excel
const isExporting = ref(false);

const requestExportExcelData = ref({
    fileName: 'Danh_sach_ca_lam_viec',
    columns: dataColumns.value,
    customFilter: '',
    filter: '',
    sort: '',
})

const requestExport = async () => {
    isExporting.value = true;
    //Delay 300ms để đảm bảo trạng thái isExporting đã được cập nhật trước khi gọi API
    const filterString = globalFilterArray.value.length > 0 ? JSON.stringify(globalFilterArray.value) : "";
    const customFilter = searchTerm.value !== '' ? buildCustomFilter(searchTerm.value) : null;
    const customFilterString = customFilter ? JSON.stringify(customFilter) : "";
    const sort = "[{\"Selector\":\"ShiftCode\",\"Desc\":false}]";
    requestExportExcelData.value.filter = filterString;
    requestExportExcelData.value.customFilter = customFilterString;
    requestExportExcelData.value.sort = sort;
    console.log('Requesting export with filter:', filterString);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        // Gọi API Export kèm theo connectionId
        const response = await shiftService.exportExcel(requestExportExcelData.value);
        const blob = response;
        let fileName = `${requestExportExcelData.value.fileName}.xlsx`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        isExporting.value = false;
        toast.error("Có lỗi xảy ra khi tải file Excel.");
    } finally {
        toast.success("Xuất Excel thành công.");
        isExporting.value = false;
    }
};
//#endregion

const handleFilter = (filterData: any) => {
    console.log('Received filter data from table component:', filterData);
    //Xử lý filterData để phù hợp với định dạng của API nếu cần thiết, sau đó gán vào biến filter để gọi API
    // Ví dụ, nếu filterData đã có định dạng đúng rồi thì chỉ cần gán thẳng vào filter.value
    // filter.value = filterData;
    handleFilterChange(filterData);
}

const handleClearFilter = (filterData: any) => {
    //Xử lý xóa filter của cột fieldKey, sau đó gọi API
    // Ví dụ, nếu API chỉ cần filter.value là đủ thì chỉ cần xóa filter của cột đó khỏi filter.value rồi gán lại
    // filter.value = filter.value.filter((f: any) => f.key !== fieldKey);
    removeFilterFromFilters(filterData.key);
}

const handleSort = (sortData: any) => {
    handleSortChange(sortData);
}




//#region Lifecycle
onMounted(async () => {
    // document.addEventListener('click', handleDocumentClick);
    // await fetchDataPaging(pagingParams.value);
    loadData(activeColumnKeys.value);
});

onBeforeUnmount(() => {

    // document.removeEventListener('click', handleDocumentClick);
});



//#endregion

</script>

<template lang="html">
    <div class="layout">
        <!-- Title -->
        <div class="title-box flex-row flex">
            <div class=" title-box__title">Ca làm việc</div>
            <MsButton class="" serverity="primary" @click="openShiftDetailModal('', 'add')">
                <div class="icon plus mi-warehouse icon16 bg-white!"></div>
                <div class="pl-[4px]">Thêm</div>
            </MsButton>
        </div>
        <!-- Body -->
        <div class="layout-body">
            <!-- Data Table -->
            <div class="table-container">
                <!-- toolbar -->
                <div class="table-container__toolbar flex-row flex justify-between items-center">
                    <!-- Left -->
                    <div class="table-container__toolbar__left flex items-center gap-x-4">
                        <MsInput class="w-[240px]" placeholder="Tìm kiếm" icon="mi-warehouse icon16 icon left search"
                            @input="executeSearch($event, activeColumnKeys)" />
                        <div v-if="filters.length > 0 && selectedRowIndices.length === 0"
                            class="filter-conditions h-full">
                            <div v-for="(filter, index) in filters" :key="index" class="filter-item">
                                <div class="lable-value-filter">
                                    <span>{{ filter.fieldLabel }}</span>
                                    <span class="text-(--primary-color)">{{ filter.operatorLabel }}</span>
                                    <span>{{ getDisplayValue(filter) }}</span>
                                </div>
                                <div class="icon icon16 mi-warehouse close cursor-pointer"
                                    @click="removeFilterFromFilters(filter.key)"></div>
                            </div>
                            <div class="hover:underline text-red-500 cursor-pointer" @click=" clearAllFilters()">
                                Bỏ lọc
                            </div>
                        </div>
                        <div class="flex items-center gap-x-2" v-if="selectedRowIndices.length > 0">
                            <div>Đã chọn: <span class="font-bold">{{ selectedRowIndices.length }}</span></div>
                            <div class="hover:underline text-(--primary-color) cursor-pointer"
                                @click="selectedRowIndices.length > 0 && (selectedRowIndices = [])">Bỏ chọn
                            </div>
                            <MsButton :serverity="'success'" :variant="'outlined'"
                                @click="updateShiftStatus(selectedShift.map(shift => shift.shiftId), false)"
                                v-if="selectedShift.some(shift => shift.shiftInactive)">
                                <div class="icon active mi-warehouse icon16 bg-(--color-success)!"></div>
                                <div class="pl-[4px] text-(--color-success)">Sử dụng</div>
                            </MsButton>
                            <MsButton :serverity="'danger'" :variant="'outlined'"
                                @click="updateShiftStatus(selectedShift.map(shift => shift.shiftId), true)"
                                v-if="selectedShift.some(shift => !shift.shiftInactive)">
                                <div class="icon empty mi-warehouse icon16 bg-(--color-danger)!"></div>
                                <div class="pl-[4px] text-(--color-danger)">Ngừng sử dụng</div>
                            </MsButton>
                            <MsButton @click="deleteShift(selectedShift.map(shift => shift.shiftId))"
                                :serverity="'danger'" :variant="'outlined'" v-if="selectedRowIndices.length > 0">
                                <div class="icon trash mi-warehouse icon16 bg-(--color-danger)!"></div>
                                <div class="pl-[4px] text-(--color-danger)">Xóa</div>
                            </MsButton>
                        </div>
                    </div>
                    <!-- Right -->
                    <div class="table-container__toolbar__right flex items-center gap-x-2">
                        <MsButton class="" serverity="secondary" variant="outlined" @click="requestExport()"
                            v-tooltip.top="'Xuất Excel'" :disabled="isExporting" `>
                            <div class="icon mi-warehouse icon16 bg-gray-600!"
                                :class="isExporting ? 'refresh animate-spin' : 'export'"></div>
                        </MsButton>
                        <MsButton class="" serverity="secondary" variant="outlined" v-tooltip.top="'Làm mới dữ liệu'"
                            @click="loadData(activeColumnKeys)">
                            <div class="icon reload mi-warehouse icon16 bg-gray-600!"></div>
                        </MsButton>
                        <MsButton class="" serverity="secondary" variant="outlined" @click=""
                            v-tooltip.top="'Cài đặt hiển thị'">
                            <div class="icon setting mi-warehouse icon16 bg-gray-600!"></div>
                        </MsButton>
                    </div>
                </div>
                <!-- Table grid -->
                <div class="table-container__table">
                    <div class="table-container__table__content">
                        <MsTableDefault :fields="fields" :rows="tableRows" :focusedRowIndex="focusedRowIndex"
                            :selectedRowIndices="selectedRowIndices" @filter="handleFilter($event)"
                            @sort="handleSort($event)" @clearFilter="handleClearFilter($event)">
                            <template #title-Checkbox="{ }">
                                <MsCheckbox type="checkbox" style="width: 16px; height: 16px" @change="handleSelectAll"
                                    :modelValue="selectedRowIndices.length === tableRows.length" />
                            </template>
                            <template #Checkbox="{ row }">
                                <MsCheckbox type="checkbox" style="width: 16px; height: 16px"
                                    @change="handleSelectRow(row)"
                                    :modelValue="selectedRowIndices.includes(tableRows.findIndex(r => r.shiftId === row.shiftId))" />
                            </template>
                            <template #shiftInactive="{ row }">
                                <!-- Active -->
                                <div v-if="!row.shiftInactive" class="qtsx-grid-status-tag active">
                                    <div class="status-dot">•</div>
                                    <div class="status-content">Đang sử dụng</div>
                                </div>
                                <!-- Inactive -->
                                <div v-else class="qtsx-grid-status-tag inactive">
                                    <div class="status-dot">•</div>
                                    <div class="status-content">Ngừng sử dụng</div>
                                </div>
                            </template>
                            <template #Action="{ row, rowIndex }">
                                <div class="flex items-center justify-center gap-2 w-full h-full ">
                                    <div class="border border-gray-300 bg-white rounded-lg flex items-center justify-center w-6 h-6 cursor-pointer group"
                                        @click="openShiftDetailModal(row.shiftId, 'edit')">
                                        <div class="icon icon16 mi-warehouse pencil group-hover:bg-(--primary-color)!"
                                            @click="">
                                        </div>
                                    </div>

                                    <div class="border border-gray-300 bg-white rounded-lg flex items-center justify-center w-6 h-6 cursor-pointer group relative"
                                        @mouseleave="closeMenu" @click="toggleMenu(row.shiftId, rowIndex as number)">
                                        <div
                                            class="icon icon16 mi-warehouse feature-more-blue group-hover:bg-(--primary-color)! group relative">
                                        </div>
                                        <!-- Dropdown menu -->
                                        <div class="pt-5 absolute top-1 right-0 z-50">
                                            <div v-if="showMenuId === row.shiftId" @click.stop=""
                                                class="mt-1 min-w-fit bg-white rounded-lg  overflow-hidden p-2 shadow-gray-300 "
                                                style="box-shadow: 0 0 8px #0000001a, 0 8px 16px #0000001a;">
                                                <div class="px-3 py-2 hover:bg-gray-100 rounded-sm cursor-pointer flex whitespace-nowrap items-center gap-2"
                                                    @click="handleDuplicateShift(row.shiftId)">
                                                    <div class="icon icon16 mi-warehouse duplicate"></div>
                                                    <div>Nhân bản</div>
                                                </div>
                                                <div class="px-3 py-2 hover:bg-gray-100 rounded-sm cursor-pointer flex whitespace-nowrap items-center gap-2"
                                                    @click="updateShiftStatus([row.shiftId], !row.shiftInactive); closeMenu()">
                                                    <template v-if="!row.shiftInactive">
                                                        <div class="icon icon16 mi-warehouse empty"></div>
                                                        <div>Ngừng sử dụng</div>
                                                    </template>
                                                    <template v-else="row.shiftInactive">
                                                        <div class="icon icon16 mi-warehouse active"></div>
                                                        <div>Sử dụng</div>
                                                    </template>
                                                </div>
                                                <div class="px-3 py-2 hover:bg-gray-100 rounded-sm cursor-pointer flex whitespace-nowrap items-center gap-2"
                                                    @click="deleteShift([row.shiftId]); closeMenu()">
                                                    <div class="icon icon16 mi-warehouse trash"></div>
                                                    <div>Xóa</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </MsTableDefault>
                    </div>
                </div>
                <!-- footer -->
                <div class="table-container__footer">
                    <!-- Left -->
                    <div>
                        <div>
                            <span>Tổng số: <span class="font-bold">{{ totalItems }}</span></span>
                        </div>
                    </div>
                    <!-- Right -->
                    <div>
                        <div class="flex items-center gap-x-4">
                            <span class="whitespace-nowrap">Số dòng/trang</span>
                            <MsSelect name="area" placeholder="Số dòng" id="areaSelect" :options="pageSizeOptions"
                                class="w-20!" valueField="value" labelField="label" v-model="pageSize"
                                @change="changePageSize($event.value)">
                            </MsSelect>
                            <span class="font-bold">{{ pageStart }} - {{ pageEnd }}</span>
                            <!-- Pagination controls -->
                            <div class="flex">
                                <MsButton class="p-1" serverity="secondary" variant="text" :disabled="!canGoPrev"
                                    :class="{ disabled: !canGoPrev }" @click="goToFirstPage">
                                    <div class="icon step-backward mi-warehouse icon16 bg-gray-500!"></div>
                                </MsButton>
                                <MsButton class="p-1" serverity="secondary" variant="text" :disabled="!canGoPrev"
                                    :class="{ disabled: !canGoPrev }" @click.stop="prevPage">
                                    <div class="icon angle-left mi-warehouse icon16 bg-gray-500!"></div>
                                </MsButton>
                                <MsButton class="p-1" serverity="secondary" variant="text" :disabled="!canGoNext"
                                    :class="{ disabled: !canGoNext }" @click.stop="nextPage">
                                    <div class="icon angle-right mi-warehouse icon16 bg-gray-500!"></div>
                                </MsButton>
                                <MsButton class="p-1" serverity="secondary" variant="text" :disabled="!canGoNext"
                                    :class="{ disabled: !canGoNext }" @click="goToLastPage">
                                    <div class="icon step-forward mi-warehouse icon16 bg-gray-500!"></div>
                                </MsButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modals -->
        <ShiftDetailModal ref="shiftDetailModalRef" @saved="handleSaved($event)" />
        <!-- Confirm Modal -->
        <MsMessage :visible="false" :title="confirmModalTitle" :message="confirmModalMessage" :variant="'danger'"
            @cancel="isConfirmModalVisible = false" @close="isConfirmModalVisible = false" @confirm="
                confirmModalAction ? confirmModalAction() : null;
            isConfirmModalVisible = false;">
            <template #template>
                <div class="confirm-modal w-108">
                    <!-- Header -->
                    <div class="confirm-modal__header flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <!-- Icon -->
                            <div v-if="confirmModalVariant === 'warning'"
                                class="icon icon20 mi-qtsx icon-warning bg-(--color-warning)! mr-2"></div>
                            <div v-if="confirmModalVariant === 'danger'"
                                class="icon icon20 mi-qtsx icon-danger bg-(--color-danger)! mr-2"></div>
                            <div v-if="confirmModalVariant === 'info'"
                                class="icon icon20 mi-qtsx icon-info bg-(--color-info)! mr-2"></div>
                            <!-- Title -->
                            <div class="confirm-modal__title">{{ confirmModalTitle }}</div>
                        </div>
                        <div class="flex items-center h-6 w-6 justify-center cursor-pointer"
                            v-tooltip.top="'Đóng (ESC)'"
                            @click="closeConfirmModalAction ? closeConfirmModalAction() : null; isConfirmModalVisible = false;">
                            <div class="icon icon20 mi-warehouse close"></div>
                        </div>
                    </div>
                    <!-- Message -->
                    <div class="confirm-modal__message" v-html="confirmModalMessage"></div>
                    <!-- Actions -->
                    <div class="confirm-modal__actions flex items-center justify-end gap-2 mt-4">
                        <MsButton class="cancel"
                            @click="closeConfirmModalAction ? closeConfirmModalAction() : null; isConfirmModalVisible = false;"
                            variant="outlined" serverity="secondary">
                            Hủy
                        </MsButton>
                        <MsButton class="submit"
                            @click="confirmModalAction ? confirmModalAction() : null; isConfirmModalVisible = false;"
                            :serverity="confirmModalVariant === 'danger' ? 'danger' : 'primary'">
                            {{ confirmModalVariant === 'danger' ? 'Xóa' : 'Đồng ý' }}
                        </MsButton>
                    </div>
                </div>
            </template>
        </MsMessage>
        <Teleport to="body">
            <TableDisplaySettings :rows="fields" v-if="false" />
        </Teleport>
    </div>
</template>

<style lang="scss" scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 20px 20px;

    &-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

    }
}

.layout {
    .title-box {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        &__title {
            font-size: 20px;
            font-weight: 700;
            font-family: Inter;
            color: var(--color-text);
        }
    }
}


.table-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* border-radius: 8px; */
    overflow: hidden;

    &__toolbar {
        padding: 12px 16px;
        background: #fff;
        border-radius: 8px 8px 0 0;
    }

    &__table {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &__content {
            flex: 1;
            overflow: auto;
            background: #fff;
            scrollbar-width: thin;
        }
    }

    &__footer {
        height: 48px;
        min-height: 48px;
        align-items: center;
        background-color: #fff;
        border-top: solid 1px #D5D7DA;
        padding: 12px 16px;
        background: #fff;
        width: 100%;
        justify-content: space-between;
        padding: 8px 16px;
        display: flex;
        border-radius: 0 0 8px 8px;
    }
}

.qtsx-grid-status-tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
    width: -moz-fit-content;
    width: fit-content;
    padding: 5px 8px;
    border-radius: 8px;
    overflow: clip;
}

.qtsx-grid-status-tag.success,
.qtsx-grid-status-tag.active {
    background-color: #ecfdf3;
    color: #12b76a;
    border: solid 1px #A6F4C5;
}

.qtsx-grid-status-tag.inactive,
.qtsx-grid-status-tag.danger {
    background-color: #fef3f2;
    color: #f04438;
    border: solid 1px #FECDCA;
}

.qtsx-grid-status-tag .status-dot {
    padding-right: 5px;
    font-size: 26px;
    line-height: 0;
}

.disabled {
    cursor: not-allowed;
    opacity: 0.3;
}


.filter-conditions {
    display: flex;
    align-items: center;
    row-gap: 4px;
    flex-wrap: wrap;
    margin-right: 8px;
    max-height: 56px;
    overflow-y: auto;

    .filter-item {
        display: flex;
        gap: 8px;
        height: 24px;
        padding: 0 8px;
        border-radius: 4px;
        position: relative;
        margin-right: 8px;
        white-space: normal;
        align-items: center;
        background-color: #f3f4f6;
        max-width: calc(100% - 8px);

        .lable-value-filter {
            display: flex;
            gap: 8px;
        }
    }


}


// Custom confirm modal
.confirm-modal {
    background-color: #fff;
    box-shadow: 0 3px 20px #00000014;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;

    &__title {
        font-weight: 600;
        color: var(--text);
        font-size: 16px;
    }

    &__message {
        font-size: 13px;
        max-height: 400px;
        overflow-y: auto;
        font-weight: 400;
        line-height: 20px;
        max-width: 100%;
        overflow-wrap: anywhere;
    }
}
</style>