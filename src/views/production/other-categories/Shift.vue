<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import MsTableDefault from '../../../components/base/ms-table/MsTableDefault.vue';
import * as signalR from '@microsoft/signalr';


//#region confirm modal state
const isConfirmModalVisible = ref(false);
const confirmModalVariant = ref<"info" | "warning" | "danger">("info");
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmModalType = ref("info");
const confirmModalAction = ref<(() => void) | null>(null);
const closeConfirmModalAction = ref<(() => void) | null>(null);
const apiDomain = 'https://localhost:7103';
//#endregion

const user = {
    id: 1,
    name: 'Nguyễn Hoàng Long',
}

//#region export excel
const isExporting = ref(false);
const connectionId = ref('');
let connection: any = null;

onMounted(async () => {
    // 1. Khởi tạo kết nối SignalR tới Backend
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiDomain}/hubs/notification`) // Thay port của bạn
        .withAutomaticReconnect()
        .build();

    // 2. Lắng nghe sự kiện Thành Công từ Server
    connection.on("ReceiveExportResult", (downloadUrl: any, message: any) => {
        isExporting.value = false;
        // alert(message); // Hiển thị Toast message (thay alert bằng thư viện Toast của bạn)

        // Tự động trigger tải file
        const fullUrl = `${apiDomain}/${downloadUrl}`;
        window.location.href = fullUrl;

        // Hoặc tạo thẻ <a> ẩn để tải:
        // const link = document.createElement('a');
        // link.href = fullUrl;
        // link.setAttribute('download', ''); // Force download
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    });

    // 3. Lắng nghe sự kiện Lỗi
    connection.on("ReceiveExportError", (errorMessage: any) => {
        isExporting.value = false;
        alert(errorMessage);
    });

    // Bắt đầu kết nối
    await connection.start();
    // Lấy ConnectionId để lát nữa gửi kèm lúc gọi API
    connectionId.value = connection.connectionId || '';
});

onUnmounted(() => {
    if (connection) connection.stop();
});

const requestExport = async () => {
    isExporting.value = true;
    //Delay 300ms để đảm bảo trạng thái isExporting đã được cập nhật trước khi gọi API
    const filter = filterBuilder();
    const filterString = filter && filter.length > 0 ? JSON.stringify(filter) : "";
    console.log('Requesting export with filter:', filterString);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
        // Gọi API Export kèm theo connectionId
        const response = await fetch(`${apiDomain}/api/export/production/shifts?connectionId=${connectionId.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                connectionId: connectionId.value,
                filter: filterString,
            }),
        });

        if (response.status === 202) {
            // API đã nhận, báo user chờ
            console.log("Đã đưa vào hàng đợi, chờ tín hiệu từ SignalR...");
        }
    } catch (error) {
        isExporting.value = false;
        // alert("Lỗi gọi API xuất Excel");
    }
};


//#endregion


import type { Shift } from '../../../types/Shift.ts';
import ModalConfirm from '../../../components/base/ms-modal/ModalConfirm.vue';

// Table settings
const currentPage = ref(1);
const pageSize = ref(localStorage.getItem('shiftTablePageSize') || '10');
const tableRows = ref<Shift[]>([]);
const totalItems = ref(0);
const totalPages = ref(0);
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

const filter = ref<string[]>([]);
const sort = ref<string[]>([]);
const columns = ref<string[]>([]);
const customFilter = ref<string[]>([]);

type PagingParams = {
    page: number;
    pageSize: string;
    filter: string[];
    sort: string[];
    columns: string[];
    customFilter: string[];
};

const pagingParams = computed<PagingParams>(() => ({
    page: currentPage.value,
    pageSize: pageSize.value,
    filter: filter.value,
    sort: sort.value,
    columns: columns.value,
    customFilter: customFilter.value,
}));

const changePageSize = (newSize: string) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    localStorage.setItem('shiftTablePageSize', newSize);
    fetchDataPaging(pagingParams.value);
};

const nextPage = () => {
    if (!canGoNext.value) {
        return;
    }
    currentPage.value += 1;
    fetchDataPaging(pagingParams.value);
};

const prevPage = () => {
    if (!canGoPrev.value) {
        return;
    }
    currentPage.value -= 1;
    fetchDataPaging(pagingParams.value);
};

const goToPage = (page: number) => {
    if (totalPages.value === 0) {
        return;
    }
    const next = Math.min(Math.max(page, 1), totalPages.value);
    currentPage.value = next;
    fetchDataPaging(pagingParams.value);
};

const goToFirstPage = () => {
    if (!canGoPrev.value) {
        return;
    }
    currentPage.value = 1;
    fetchDataPaging(pagingParams.value);
};

const goToLastPage = () => {
    if (!canGoNext.value) {
        return;
    }
    currentPage.value = totalPages.value;
    fetchDataPaging(pagingParams.value);
};

const pageSizeNumber = computed(() => Number(pageSize.value) || 0);
const canGoPrev = computed(() => currentPage.value > 1);
const canGoNext = computed(() => totalPages.value > 0 && currentPage.value < totalPages.value);
const pageStart = computed(() => {
    if (totalItems.value === 0 || pageSizeNumber.value === 0) {
        return 0;
    }
    return (currentPage.value - 1) * pageSizeNumber.value + 1;
});
const pageEnd = computed(() => {
    if (totalItems.value === 0 || pageSizeNumber.value === 0) {
        return 0;
    }
    return Math.min(currentPage.value * pageSizeNumber.value, totalItems.value);
});

//#region Search debounce
const searchTimeout = ref<number | null>(null);
const onSearchInput = (value: string) => {
    console.log('Search input:', value);
    searchTerm.value = value;
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }
    searchTimeout.value = window.setTimeout(() => {
        customFilter.value = buildCustomFilter(searchTerm.value) as unknown as string[];
        currentPage.value = 1;
        fetchDataPaging(pagingParams.value);
    }, 500);
};
//#endregion

const searchColumns = ['ShiftCode', 'ShiftName', 'CreatedBy', 'ModifiedBy'];
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

const fetchDataPaging = async (pagingParams: PagingParams) => {
    // xây dựng filter
    pagingParams.filter = filterBuilder();
    const params = {
        pageIndex: pagingParams.page,
        pageSize: pagingParams.pageSize,
        filter: pagingParams.filter && pagingParams.filter.length > 0 ? JSON.stringify(pagingParams.filter) : "",
        sort: pagingParams.sort && pagingParams.sort.length > 0 ? JSON.stringify(pagingParams.sort) : "",
        columns: pagingParams.columns && pagingParams.columns.length > 0 ? JSON.stringify(pagingParams.columns) : "",
        customFilter: pagingParams.customFilter && pagingParams.customFilter.length > 0 ? JSON.stringify(pagingParams.customFilter) : "",
    };
    const response = await fetch(`${apiDomain}/api/Shifts/dataPaging`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    }).then(res => res.json()).then(response => {
        tableRows.value = response.data.data as Shift[];
        totalItems.value = response.data.total;
        totalPages.value = response.data.totalPages;
        selectedRowIndices.value = [];
        console.log('Data fetched:', response);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });

}



const fields = [
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
        exportable: true,
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
        key: 'shiftCode', label: 'Mã ca', type: "text", resizable: true, filterable: true,
        filterType: "text",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '120px',
        },
    },
    {
        key: 'shiftName', label: 'Tên ca', type: "text", resizable: true, filterable: true,
        filterType: "text",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '250px',
        },
    },
    {
        key: 'shiftBeginTime', label: 'Giờ vào ca', type: 'time', resizable: true, filterable: false,
        style: {
            width: '130px',
        },
    },
    {
        key: 'shiftEndTime', label: 'Giờ hết ca', type: 'time', resizable: true, filterable: false,
        style: {
            width: '130px',
        },
    },
    {
        key: 'shiftBeginBreakTime', label: 'Bắt đầu nghỉ giữa ca', type: 'time', resizable: true, filterable: false,
        style: {
            width: '200px',
        },
    },
    {
        key: 'shiftEndBreakTime', label: 'Kết thúc nghỉ giữa ca', type: 'time', resizable: true, filterable: false,
        style: {
            width: '210px',
        },
    },
    {
        key: 'shiftWorkingTime', label: 'Thời gian làm việc (giờ)', type: 'number', resizable: true, filterable: true,
        filterType: "number",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '210px',
        },
    },
    {
        key: 'shiftBreakingTime', label: 'Thời gian nghỉ giữa ca (giờ)', type: 'number', resizable: true, filterable: true,
        filterType: "number",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '230px',
        },
    },
    {
        key: 'shiftInactive', label: 'Trạng thái', type: 'custom', resizable: true, filterable: true,
        filterType: "select",
        filterData: {
            operator: '',
            value: '',
        },
        selectOptions: [
            { label: 'Ngừng sử dụng', value: 'true' },
            { label: 'Đang sử dụng', value: 'false' },
        ],
        style: {
            width: '230px',
        },
    },
    {
        key: 'createdBy', label: 'Người tạo', type: "text", resizable: true, filterable: true,
        filterType: "text",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '200px',
        },
    },
    {
        key: 'createdDate', label: 'Ngày tạo', type: "date", resizable: true, filterable: true,
        filterType: "date",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '160px',
        },
    },
    {
        key: 'modifiedBy', label: 'Người sửa', type: "text", resizable: true, filterable: true,
        filterType: "text",
        filterData: {
            operator: '',
            value: '',
        },
        style: {
            width: '160px',
        },
    },
    {
        key: 'modifiedDate', label: 'Ngày sửa', type: "date", resizable: true, filterable: true,
        filterType: "date",
        filterData: {
            operator: '',
            value: '',
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

];

const showMenuId = ref<string | null>(null);
const toggleMenu = (rowId: string) => {
    showMenuId.value = showMenuId.value === rowId ? null : rowId;
};
const focusedRowIndex = ref<number>(-1);

const closeMenu = () => {
    showMenuId.value = null;
};

const handleDocumentClick = () => {
    closeMenu();
};

const formShiftError = ref({
    shiftCode: '',
    shiftName: '',
    shiftBeginTime: '',
    shiftEndTime: '',
    shiftBeginBreakTime: '',
    shiftEndBreakTime: '',
    shiftWorkingTime: '',
    shiftBreakingTime: '',
});

//#region validate
const validateShiftCode = (code: string) => {
    if (!code) {
        formShiftError.value.shiftCode = 'Mã ca không được để trống';
        return false;
    } else if (code.length > 20) {
        formShiftError.value.shiftCode = 'Mã ca không được vượt quá 20 ký tự';
        return false;
    }
    formShiftError.value.shiftCode = '';
    return true;
};
const validateShiftName = (name: string) => {
    if (!name) {
        formShiftError.value.shiftName = 'Tên ca không được để trống';
        return false;
    } else if (name.length > 50) {
        formShiftError.value.shiftName = 'Tên ca không được vượt quá 50 ký tự';
        return false;
    }
    formShiftError.value.shiftName = '';
    return true;
};

const validateShiftBeginTime = (time: string | null) => {
    if (!time) {
        formShiftError.value.shiftBeginTime = 'Giờ vào ca không được để trống';
        return false;
    }
    const beginTime = formShiftData.value.shiftBeginTime;
    const endTime = formShiftData.value.shiftEndTime;
    if (beginTime === endTime) {
        formShiftError.value.shiftBeginTime = 'Giờ hết ca không được bằng giờ vào ca.';
        return false;
    }
    formShiftError.value.shiftBeginTime = '';
    return true;
};

const validateShiftEndTime = (time: string | null) => {
    if (!time) {
        formShiftError.value.shiftEndTime = 'Giờ hết ca không được để trống';
        return false;
    }
    const beginTime = formShiftData.value.shiftBeginTime;
    const endTime = formShiftData.value.shiftEndTime;
    if (beginTime === endTime) {
        formShiftError.value.shiftEndTime = 'Giờ hết ca không được bằng giờ vào ca.';
        return false;
    }
    formShiftError.value.shiftEndTime = '';
    return true;
};

const validateShiftBeginBreakTime = (time: string | null) => {
    // Không bắt buộc, chỉ validate nếu có giá trị
    // Kiểm tra nếu giờ bắt đầu nghỉ không nằm trong giờ làm việc
    if (!time && formShiftData.value.shiftEndBreakTime) {
        formShiftError.value.shiftBeginBreakTime = 'Bắt đầu nghỉ giữa ca không được để trống khi đã có Kết thúc nghỉ giữa ca.';
        return false;
    }
    if (time && formShiftData.value.shiftEndTime && formShiftData.value.shiftBeginTime) {
        const beginTime = new Date(`2000-01-01T${formShiftData.value.shiftBeginTime}:00`);
        const endTime = new Date(`2000-01-01T${formShiftData.value.shiftEndTime}:00`);
        if (endTime < beginTime) {
            endTime.setDate(endTime.getDate() + 1); // Nếu giờ kết thúc nhỏ hơn hoặc bằng giờ bắt đầu, cộng thêm 1 ngày để xử lý ca qua đêm
        }
        //Nếu có giờ kết thúc nghỉ
        if (formShiftData.value.shiftEndBreakTime) {
            const beginBreakTime = new Date(`2000-01-01T${time}:00`);
            const endBreakTime = new Date(`2000-01-01T${formShiftData.value.shiftEndBreakTime}:00`);
            // Nếu giờ bắt đầu nghỉ bằng giờ kết thúc nghỉ
            if (beginBreakTime === endBreakTime) {
                formShiftError.value.shiftBeginBreakTime = 'Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.';
                return false;
            }
            // Nếu giờ bắt đầu nghỉ lớn hơn giờ kết thúc nghỉ, cộng thêm 1 ngày cho giờ kết thúc nghỉ để xử lý trường hợp nghỉ qua đêm
            else if (beginBreakTime > endBreakTime) {
                endBreakTime.setDate(endBreakTime.getDate() + 1); // Nếu giờ kết thúc nghỉ nhỏ hơn hoặc bằng giờ bắt đầu nghỉ, cộng thêm 1 ngày để xử lý trường hợp nghỉ qua đêm
            }
            // Kiểm tra nếu giờ bắt đầu nghỉ không nằm trong khoảng thời gian từ giờ vào ca đến giờ hết ca
            if (beginBreakTime < beginTime || beginBreakTime > endTime) {
                formShiftError.value.shiftBeginBreakTime = 'Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.';
                return false;
            }
        } else {
            const beginBreakTime = new Date(`2000-01-01T${time}:00`);
            const endTime = new Date(`2000-01-01T${formShiftData.value.shiftEndTime}:00`);
            // Kiểm tra nếu giờ bắt đầu nghỉ không nằm trong khoảng thời gian từ giờ vào ca đến giờ hết ca
            if (beginBreakTime < beginTime && beginBreakTime > endTime) {
                formShiftError.value.shiftBeginBreakTime = 'Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.';
                return false;
            }
        }
    }
    formShiftError.value.shiftBeginBreakTime = '';
    return true;
};

const validateShiftEndBreakTime = (time: string | null) => {
    // Không bắt buộc, chỉ validate nếu có giá trị
    // Kiểm tra nếu giờ kết thúc nghỉ không nằm trong giờ làm việc
    if (!time && formShiftData.value.shiftBeginBreakTime) {
        formShiftError.value.shiftEndBreakTime = 'Kết thúc nghỉ giữa ca không được để trống khi đã có Bắt đầu nghỉ giữa ca.';
        return false;
    }
    if (time && formShiftData.value.shiftEndTime && formShiftData.value.shiftBeginTime) {
        const beginTime = new Date(`2000-01-01T${formShiftData.value.shiftBeginTime}:00`);
        const endTime = new Date(`2000-01-01T${formShiftData.value.shiftEndTime}:00`);
        if (endTime < beginTime) {
            endTime.setDate(endTime.getDate() + 1); // Nếu giờ kết thúc nhỏ hơn hoặc bằng giờ bắt đầu, cộng thêm 1 ngày để xử lý ca qua đêm
        }
        //Nếu có giờ bắt đầu nghỉ
        if (formShiftData.value.shiftBeginBreakTime) {
            const beginBreakTime = new Date(`2000-01-01T${formShiftData.value.shiftBeginBreakTime}:00`);
            const endBreakTime = new Date(`2000-01-01T${time}:00`);
            // Nếu giờ kết thúc nghỉ bằng giờ bắt đầu nghỉ
            if (endBreakTime === beginBreakTime) {
                formShiftError.value.shiftEndBreakTime = 'Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.';
                return false;
            }// Nếu giờ kết thúc nghỉ lớn hơn giờ bắt đầu nghỉ, cộng thêm 1 ngày cho giờ kết thúc nghỉ để xử lý trường hợp nghỉ qua đêm
            else if (beginBreakTime > endBreakTime) {
                endBreakTime.setDate(endBreakTime.getDate() + 1); // Nếu giờ kết thúc nghỉ nhỏ hơn hoặc bằng giờ bắt đầu nghỉ, cộng thêm 1 ngày để xử lý trường hợp nghỉ qua đêm
            }
            // Kiểm tra nếu giờ kết thúc nghỉ không nằm trong khoảng thời gian từ giờ vào ca đến giờ hết ca
            if (endBreakTime < beginTime || endBreakTime > endTime) {
                formShiftError.value.shiftEndBreakTime = 'Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.';
                return false;
            }
        }
    }
    formShiftError.value.shiftEndBreakTime = '';
    return true;
};
//#endregion


const formShiftData = ref({
    shiftId: '',
    shiftCode: '',
    shiftName: '',
    shiftDescription: '',
    shiftBeginTime: '' as string | null,
    shiftEndTime: '' as string | null,
    shiftBeginBreakTime: '' as string | null,
    shiftEndBreakTime: '' as string | null,
    shiftWorkingTime: 0.0000,
    shiftBreakingTime: 0.0000,
    shiftInactive: false,
    createdBy: '',
    modifiedBy: '',
});

const formShiftBeforeEditData = ref({
    shiftId: '',
    shiftCode: '',
    shiftName: '',
    shiftDescription: '',
    shiftBeginTime: '' as string | null,
    shiftEndTime: '' as string | null,
    shiftBeginBreakTime: '' as string | null,
    shiftEndBreakTime: '' as string | null,
    shiftWorkingTime: 0.0000,
    shiftBreakingTime: 0.0000,
    shiftInactive: false,
    createdBy: '',
    modifiedBy: '',
});

const resetFormShiftError = () => {
    formShiftError.value = {
        shiftCode: '',
        shiftName: '',
        shiftBeginTime: '',
        shiftEndTime: '',
        shiftBeginBreakTime: '',
        shiftEndBreakTime: '',
        shiftWorkingTime: '',
        shiftBreakingTime: '',
    };
};

const isAddEditShiftModalVisible = ref(false);
const showAddEditShiftModal = (shiftId: string | null) => {
    resetFormShiftError();
    // Logic to add a new shift
    console.log('Show add/edit shift modal for shift ID:', shiftId);
    if (shiftId) {
        // Edit existing shift logic
        const shift = tableRows.value.find((r) => r.shiftId === shiftId);
        if (shift) {
            formShiftData.value = {
                shiftId: shift.shiftId,
                shiftCode: shift.shiftCode,
                shiftName: shift.shiftName,
                shiftDescription: shift.shiftDescription,
                shiftBeginTime: shift.shiftBeginTime,
                shiftEndTime: shift.shiftEndTime,
                shiftBeginBreakTime: shift.shiftBeginBreakTime ?? null,
                shiftEndBreakTime: shift.shiftEndBreakTime ?? null,
                shiftWorkingTime: shift.shiftWorkingTime,
                shiftBreakingTime: shift.shiftBreakingTime,
                shiftInactive: shift.shiftInactive,
                createdBy: shift.createdBy,
                modifiedBy: '',
            };
            formShiftBeforeEditData.value = { ...formShiftData.value };
            calculateShiftTimes();
        }
    } else {
        // Add new shift logic
        formShiftData.value = {
            shiftId: '',
            shiftCode: '',
            shiftName: '',
            shiftDescription: '',
            shiftBeginTime: '' as string | null,
            shiftEndTime: '' as string | null,
            shiftBeginBreakTime: '' as string | null,
            shiftEndBreakTime: '' as string | null,
            shiftWorkingTime: 0,
            shiftBreakingTime: 0,
            shiftInactive: false,
            createdBy: '',
            modifiedBy: '',
        };
        formShiftBeforeEditData.value = { ...formShiftData.value };
    }
    isAddEditShiftModalVisible.value = true;
};

const handleDuplicateShift = (shiftId: string) => {
    console.log('Duplicate shift with ID:', shiftId);
    resetFormShiftError();
    const shift = tableRows.value.find((r) => r.shiftId === shiftId);
    if (shift) {
        formShiftData.value = {
            shiftId: '',
            shiftCode: '',
            shiftName: shift.shiftName,
            shiftDescription: shift.shiftDescription,
            shiftBeginTime: shift.shiftBeginTime,
            shiftEndTime: shift.shiftEndTime,
            shiftBeginBreakTime: shift.shiftBeginBreakTime ?? null,
            shiftEndBreakTime: shift.shiftEndBreakTime ?? null,
            shiftWorkingTime: shift.shiftWorkingTime,
            shiftBreakingTime: shift.shiftBreakingTime,
            shiftInactive: false,
            createdBy: '',
            modifiedBy: '',
        };
        formShiftBeforeEditData.value = { ...formShiftData.value };
        calculateShiftTimes();
        isAddEditShiftModalVisible.value = true;
    }
};

const closeAddEditShiftModal = (checkUnsaved = true) => {
    //Check if form before edit data is different with current form data, if different show confirm modal
    if (!checkUnsaved) {
        isAddEditShiftModalVisible.value = false;
        //Delay to ensure modal close animation is smooth before resetting form data
        setTimeout(() => {
            resetFormShiftData();
        }, 300);
        return;
    }
    const isDataChanged = JSON.stringify(formShiftData.value) !== JSON.stringify(formShiftBeforeEditData.value);
    if (isDataChanged) {
        console.log('Data has been changed. Showing confirm modal before closing.');
        confirmModalVariant.value = 'info';
        confirmModalTitle.value = 'Thoát và không lưu?';
        confirmModalMessage.value = 'Nếu bạn thoát, các dữ liệu đang nhập liệu sẽ không được lưu lại.';
        isConfirmModalVisible.value = true;
        confirmModalAction.value = () => {
            isAddEditShiftModalVisible.value = false;
            isConfirmModalVisible.value = false;
            //Delay to ensure modal close animation is smooth before resetting form data
            setTimeout(() => {
                resetFormShiftData();
            }, 300);
        };
    } else {
        isAddEditShiftModalVisible.value = false;
        //Delay to ensure modal close animation is smooth before resetting form data
        setTimeout(() => {
            resetFormShiftData();
        }, 300);
    }

    // isAddEditShiftModalVisible.value = false;
    // //Delay to ensure modal close animation is smooth before resetting form data
    // setTimeout(() => {
    //     resetFormShiftData();
    // }, 300);
};

const resetFormShiftData = () => {
    formShiftData.value = {
        shiftId: '',
        shiftCode: '',
        shiftName: '',
        shiftDescription: '',
        shiftBeginTime: '' as string | null,
        shiftEndTime: '' as string | null,
        shiftBeginBreakTime: '' as string | null,
        shiftEndBreakTime: '' as string | null,
        shiftWorkingTime: 0,
        shiftBreakingTime: 0,
        shiftInactive: false,
        createdBy: '',
        modifiedBy: '',
    };
};

const validateShiftForm = () => {
    const isValidCode = validateShiftCode(formShiftData.value.shiftCode);
    const isValidName = validateShiftName(formShiftData.value.shiftName);
    const isValidBeginTime = validateShiftBeginTime(formShiftData.value.shiftBeginTime);
    const isValidEndTime = validateShiftEndTime(formShiftData.value.shiftEndTime);
    const isValidBeginBreakTime = validateShiftBeginBreakTime(formShiftData.value.shiftBeginBreakTime);
    const isValidEndBreakTime = validateShiftEndBreakTime(formShiftData.value.shiftEndBreakTime);

    return isValidCode && isValidName && isValidBeginTime && isValidEndTime && isValidBeginBreakTime && isValidEndBreakTime;
};

// Convert time fields to HH:mm:ss format if they are not already
const convertToTimeString = (time: string | null) => {
    if (!time) return null;
    if (time.length === 5) {
        return time + ':00';
    }
    return time;
};

const shiftCodeInput = ref<any>(null);
const shiftNameInput = ref<any>(null);
const shiftBeginTimeInput = ref<any>(null);
const shiftEndTimeInput = ref<any>(null);
const shiftBeginBreakTimeInput = ref<any>(null);
const shiftEndBreakTimeInput = ref<any>(null);

const handleSaveShift = () => {
    // Validate form data
    resetFormShiftError();
    if (!validateShiftForm()) {
        console.log('Validation failed:', formShiftError.value);
        let focusField = () => { }
        if (formShiftError.value.shiftCode) {
            // Show modal error message
            focusField = () => {
                shiftCodeInput.value?.$el.querySelector('input')?.focus();
            };
            confirmModalMessage.value = formShiftError.value.shiftCode;
        }
        else if (formShiftError.value.shiftName) {
            focusField = () => {
                shiftNameInput.value?.$el.querySelector('input')?.focus();
            };
            confirmModalMessage.value = formShiftError.value.shiftName;
        }
        else if (formShiftError.value.shiftBeginTime) {
            focusField = () => {
                shiftBeginTimeInput.value?.$el.querySelector('input')?.focus();
            };
            confirmModalMessage.value = formShiftError.value.shiftBeginTime;
        }
        else if (formShiftError.value.shiftEndTime) {
            focusField = () => {
                shiftEndTimeInput.value?.$el.querySelector('input')?.focus();
            };
            confirmModalMessage.value = formShiftError.value.shiftEndTime;
        }
        else if (formShiftError.value.shiftBeginBreakTime) {
            focusField = () => {
                shiftBeginBreakTimeInput.value?.$el.querySelector('input')?.focus();
            };
            confirmModalMessage.value = formShiftError.value.shiftBeginBreakTime;
        }
        else if (formShiftError.value.shiftEndBreakTime) {
            focusField = () => {
                shiftEndBreakTimeInput.value?.$el.querySelector('input')?.focus();
            };
            confirmModalMessage.value = formShiftError.value.shiftEndBreakTime;
        }

        confirmModalVariant.value = 'warning';
        confirmModalTitle.value = 'Cảnh báo';
        isConfirmModalVisible.value = true;
        closeConfirmModalAction.value = () => {
            isConfirmModalVisible.value = false;
            //Delay to ensure modal close animation is smooth before focusing field
            focusField();

        };
        confirmModalAction.value = () => {
            isConfirmModalVisible.value = false;
            //Delay to ensure modal close animation is smooth before focusing field
            focusField();

        };
        return;
    }

    // Convert time fields to HH:mm:ss format if they are not already
    formShiftData.value.shiftBeginTime = convertToTimeString(formShiftData.value.shiftBeginTime);
    formShiftData.value.shiftEndTime = convertToTimeString(formShiftData.value.shiftEndTime);
    formShiftData.value.shiftBeginBreakTime = convertToTimeString(formShiftData.value.shiftBeginBreakTime);
    formShiftData.value.shiftEndBreakTime = convertToTimeString(formShiftData.value.shiftEndBreakTime);
    formShiftData.value.shiftWorkingTime = Number(shiftWorkingTime.value);
    formShiftData.value.shiftBreakingTime = Number(shiftBreakingTime.value);

    // Edit logic
    if (formShiftData.value.shiftId) {
        console.log('Saving edited shift:', formShiftData.value);
        formShiftData.value.modifiedBy = user.name;
        // Call API to update shift
        const response = fetch(`${apiDomain}/api/Shifts/${formShiftData.value.shiftId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formShiftData.value),
        }).then(res => res.json()).then(response => {
            console.log('Shift updated successfully:', response);
            // Refresh table data after saving
            fetchDataPaging(pagingParams.value);
        }).catch(error => {
            console.error('Error updating shift:', error);
        });
    } else {
        // Add logic
        console.log('Saving new shift:', formShiftData.value);
        formShiftData.value.createdBy = user.name;
        formShiftData.value.modifiedBy = user.name;
        // Call API to create new shift
        const response = fetch(`${apiDomain}/api/Shifts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formShiftData.value),
        }).then(res => res.json()).then(response => {
            console.log('Shift saved successfully:', response);
            // Refresh table data after saving
            fetchDataPaging(pagingParams.value);
        }).catch(error => {
            console.error('Error saving shift:', error);
        });

    }
    closeAddEditShiftModal(false);
};


//#region selected rows
//test selectedRowIndices 0 1 2 3
const selectedRowIndices = ref<number[]>([]);
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
const deleteShift = (shiftIds: string[]) => {
    console.log('Delete shifts with IDs:', shiftIds);
    confirmModalVariant.value = "warning";
    confirmModalTitle.value = "Xóa Ca làm việc";
    if (shiftIds.length === 1) {
        const shift = tableRows.value.find(r => r.shiftId === shiftIds[0]);
        confirmModalMessage.value = /* html */ `<span>Ca làm việc <span class="font-semibold">${shift?.shiftCode}</span> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?</span>`;
    } else {
        confirmModalMessage.value = /* html */ `<span>Các <span class="font-semibold">Ca làm việc</span> sau khi bị xóa sẽ không thể khôi phục. Bạn có muốn tiếp tục xóa không?</span>`;
    }
    confirmModalType.value = "warning";
    isConfirmModalVisible.value = true;
    confirmModalAction.value = async () => {
        // Call API to delete shifts
        const response = fetch(`${apiDomain}/api/Shifts/bulk-delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shiftIds),
        }).then(res => res.json()).then(response => {
            console.log('Shifts deleted successfully:', response);
            // Refresh table data after deleting
            fetchDataPaging(pagingParams.value);
        }).catch(error => {
            console.error('Error deleting shifts:', error);
        });
    };
};

const updateShiftStatus = (shiftIds: string[], inactive: boolean) => {
    console.log(`${inactive ? 'Deactivate' : 'Activate'} shifts with IDs:`, shiftIds);
    // Call API to update shift status
    const response = fetch(`${apiDomain}/api/Shifts/update-inactive`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shiftIds, inactive }),
    }).then(res => res.json()).then(response => {
        console.log('Shifts status updated successfully:', response);
        // Refresh table data after updating status
        fetchDataPaging(pagingParams.value);
    }).catch(error => {
        console.error('Error updating shifts status:', error);
    });
};
//#endregion

//#region calculate shift working time and breaking time
const shiftWorkingTime = ref('');
const shiftBreakingTime = ref('');
const calculateShiftTimes = () => {
    let timeWorking = 0;
    let timeBreaking = 0;
    if (formShiftData.value.shiftBeginTime && formShiftData.value.shiftEndTime) {
        const begin = new Date(`1970-01-01T${formShiftData.value.shiftBeginTime}`);
        const end = new Date(`1970-01-01T${formShiftData.value.shiftEndTime}`);
        if (end < begin) {
            // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu, cộng thêm 1 ngày vào giờ kết thúc để tính toán đúng
            end.setDate(end.getDate() + 1);
        }
        let workingTime = (end.getTime() - begin.getTime()) / (1000 * 60 * 60);
        if (workingTime < 0) {
            workingTime += 24; // Handle overnight shifts
        }
        timeWorking = workingTime;
    } else {
        timeWorking = 0;
    }

    if (formShiftData.value.shiftBeginBreakTime && formShiftData.value.shiftEndBreakTime) {
        const breakBegin = new Date(`1970-01-01T${formShiftData.value.shiftBeginBreakTime}`);
        const breakEnd = new Date(`1970-01-01T${formShiftData.value.shiftEndBreakTime}`);
        if (breakEnd < breakBegin) {
            // Nếu giờ kết thúc nghỉ nhỏ hơn giờ bắt đầu nghỉ, cộng thêm 1 ngày vào giờ kết thúc nghỉ để tính toán đúng
            breakEnd.setDate(breakEnd.getDate() + 1);
        }
        let breakingTime = (breakEnd.getTime() - breakBegin.getTime()) / (1000 * 60 * 60);
        if (breakingTime < 0) {
            breakingTime += 24; // Handle overnight breaks
        }
        timeBreaking = breakingTime;
    } else {
        timeBreaking = 0;
    }
    timeWorking = timeWorking - timeBreaking; // Trừ thời gian nghỉ giữa ca ra khỏi thời gian làm việc
    if (timeWorking < 0) {
        shiftWorkingTime.value = `(${Math.abs(timeWorking).toFixed(3)})`; // Hiển thị thời gian làm việc âm trong trường hợp thời gian nghỉ giữa ca lớn hơn thời gian làm việc
    } else {
        shiftWorkingTime.value = timeWorking.toFixed(3);
    }
    if (timeBreaking < 0) {
        shiftBreakingTime.value = `(${Math.abs(timeBreaking).toFixed(3)})`; // Hiển thị thời gian nghỉ giữa ca âm trong trường hợp giờ kết thúc nghỉ nhỏ hơn giờ bắt đầu nghỉ
    } else {
        shiftBreakingTime.value = timeBreaking.toFixed(3);
    }
};
//#region Lifecycle

//#region filter logic
const filterModalRef = ref<any>(null);
const filterModalVisible = ref(false);
const filterModalPosition = ref({ top: '0px', left: '0px', width: `${0}px` });
const currentFilterField = ref<any>(null);
const filterModalWidth = 350;
const filterMessage = ref('');

// biến lưu các lựa chọn filter của từng cột gồm {key, operator, value} ví dụ {key: "shiftCode", operator: "contains", value: "ca"}
const columnFilters = ref<{
    key: string;
    type: string;
    fieldLabel: string;
    operatorLabel: string;
    operator: string;
    value: any;
}[]>([]);

const textFilterData = ref({
    operator: 'contains',
    value: '',
});
const numberFilterData = ref({
    operator: '=',
    value: '',
});
const dateFilterData = ref({
    operator: '=',
    value: '',
});
const selectFilterData = ref({
    operator: '=',
    value: '',
});

const clearFilterData = () => {
    textFilterData.value = {
        operator: 'contains',
        value: '',
    };
    numberFilterData.value = {
        operator: '=',
        value: '',
    };
    dateFilterData.value = {
        operator: '=',
        value: '',
    };
    selectFilterData.value = {
        operator: '=',
        value: '',
    };
};

// Các tùy chọn filter cho từng loại dữ liệu
const textFilterOptions = [
    { label: 'Bằng', value: '=' },
    { label: 'Khác', value: '<>' },
    { label: 'Chứa', value: 'contains' },
    { label: 'Không chứa', value: 'notcontains' },
    { label: 'Bắt đầu với', value: 'startswith' },
    { label: 'Kết thúc với', value: 'endswith' },
    { label: '(Trống)', value: 'isnull' },
    { label: '(Không trống)', value: 'isnotnull' },
];

const numberFilterOptions = [
    { label: 'Bằng', value: '=' },
    { label: 'Khác', value: '<>' },
    { label: 'Nhỏ hơn', value: '<' },
    { label: 'Nhỏ hơn hoặc bằng', value: '<=' },
    { label: 'Lớn hơn', value: '>' },
    { label: 'Lớn hơn hoặc bằng', value: '>=' },
    { label: '(Trống)', value: 'isnull' },
    { label: '(Không trống)', value: 'isnotnull' },
];

const dateFilterOptions = [
    { label: 'Bằng', value: '=' },
    { label: 'Khác', value: '<>' },
    { label: 'Nhỏ hơn', value: '<' },
    { label: 'Nhỏ hơn hoặc bằng', value: '<=' },
    { label: 'Lớn hơn', value: '>' },
    { label: 'Lớn hơn hoặc bằng', value: '>=' },
    { label: '(Trống)', value: 'isnull' },
    { label: '(Không trống)', value: 'isnotnull' },
];

const textFilterInput = ref<any>(null);
const numberFilterInput = ref<any>(null);
const dateFilterInput = ref<any>(null);
const selectFilterInput = ref<any>(null);


const filterBuilder = () => {
    if (!columnFilters.value || columnFilters.value.length === 0) return [];

    const result: any[] = [];

    columnFilters.value.forEach((filter, index) => {
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
        if (index < columnFilters.value.length - 1) {
            result.push("and");
        }
    });

    return result;
};

const addFilterToColumnFilters = (fieldKey: string, type: string, fieldLabel: string, operator: string, operatorLabel: string, value: any) => {
    const existingFilterIndex = columnFilters.value.findIndex((f) => f.key === fieldKey);
    if (existingFilterIndex !== -1) {
        columnFilters.value[existingFilterIndex].operator = operator;
        columnFilters.value[existingFilterIndex].value = value;
        columnFilters.value[existingFilterIndex].type = type;
        columnFilters.value[existingFilterIndex].fieldLabel = fieldLabel;
        columnFilters.value[existingFilterIndex].operatorLabel = operatorLabel;
    } else {
        columnFilters.value.push({ key: fieldKey, type: type, fieldLabel: fieldLabel, operatorLabel: operatorLabel, operator, value });
    }
};

const removeFilterFromColumnFilters = async (fieldKey: string) => {
    const index = columnFilters.value.findIndex((f) => f.key === fieldKey);
    if (index !== -1) {
        const field = fields.find((f) => f.key === fieldKey);
        if (field) {
            field.filterData = {
                operator: '',
                value: '',
            };
        }
        columnFilters.value.splice(index, 1);

    }

    await fetchDataPaging(pagingParams.value);
};

const getOperatorLabel = (filterType: string, operatorValue: string) => {
    if (filterType === 'text') {
        const option = textFilterOptions.find((o) => o.value === operatorValue);
        return option ? option.label : operatorValue;
    } else if (filterType === 'number') {
        const option = numberFilterOptions.find((o) => o.value === operatorValue);
        return option ? option.label : operatorValue;
    } else if (filterType === 'date') {
        const option = dateFilterOptions.find((o) => o.value === operatorValue);
        return option ? option.label : operatorValue;
    } else if (filterType === 'select') {
        const option = currentFilterField.value.selectOptions.find((o: any) => o.value === operatorValue);
        console.log('Get operator label for select filter:', option.label);
        return option ? option.label : operatorValue;
    }
    return operatorValue;
};


const applyFilter = async () => {
    if (!currentFilterField.value) return;
    // Lấy field đang filter hiện tại
    const field = fields.find((f) => f.key === currentFilterField.value.key);
    if (!field) return;
    //Cách 1: Kiểm tra nếu value rỗng thì không thêm filter 
    if (field.filterType === 'text') {
        //Kiểm tra nếu textFilterData operator là isnull hoặc isnotnull thì không cần value vẫn áp dụng filter được, ngược lại nếu operator khác mà value rỗng thì sẽ không áp dụng filter và yêu cầu người dùng nhập value
        if ((textFilterData.value.operator === 'isnull' || textFilterData.value.operator === 'isnotnull') || textFilterData.value.value) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = textFilterData.value.operator;
            field.filterData.value = textFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, textFilterData.value.operator, getOperatorLabel(field.filterType, textFilterData.value.operator), textFilterData.value.value);
        } else if (textFilterData.value.value) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = textFilterData.value.operator;
            field.filterData.value = textFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, textFilterData.value.operator, getOperatorLabel(field.filterType, textFilterData.value.operator), textFilterData.value.value);
        } else {
            textFilterInput.value?.$el.querySelector('input')?.focus();
            filterMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
            return;
        }
    } else if (field.filterType === 'number') {
        //Kiểm tra nếu numberFilterData operator là isnull hoặc isnotnull thì không cần value vẫn áp dụng filter được, ngược lại nếu operator khác mà value rỗng thì sẽ không áp dụng filter và yêu cầu người dùng nhập value
        if ((numberFilterData.value.operator === 'isnull' || numberFilterData.value.operator === 'isnotnull') || numberFilterData.value.value) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = numberFilterData.value.operator;
            field.filterData.value = numberFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, numberFilterData.value.operator, getOperatorLabel(field.filterType, numberFilterData.value.operator), numberFilterData.value.value);
        } else if (numberFilterData.value.value) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = numberFilterData.value.operator;
            field.filterData.value = numberFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, numberFilterData.value.operator, getOperatorLabel(field.filterType, numberFilterData.value.operator), numberFilterData.value.value);
        } else {
            numberFilterInput.value?.$el.querySelector('input')?.focus();
            filterMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
            return;
        }
    } else if (field.filterType === 'date') {
        //Kiểm tra nếu dateFilterData operator là isnull hoặc isnotnull thì không cần value vẫn áp dụng filter được, ngược lại nếu operator khác mà value rỗng thì sẽ không áp dụng filter và yêu cầu người dùng nhập value
        if ((dateFilterData.value.operator === 'isnull' || dateFilterData.value.operator === 'isnotnull') || dateFilterData.value.value) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = dateFilterData.value.operator;
            field.filterData.value = dateFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, dateFilterData.value.operator, getOperatorLabel(field.filterType, dateFilterData.value.operator), dateFilterData.value.value);
        } else if (dateFilterData.value.value) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = dateFilterData.value.operator;
            field.filterData.value = dateFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, dateFilterData.value.operator, getOperatorLabel(field.filterType, dateFilterData.value.operator), dateFilterData.value.value);
        } else {
            dateFilterInput.value?.$el.querySelector('input')?.focus();
            filterMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
            return;
        }
    } else if (field.filterType === 'select') {
        console.log('Select filter value:', selectFilterData.value.value);
        if (selectFilterData.value.value !== '' && selectFilterData.value.value !== null && selectFilterData.value.value !== undefined) {
            // Thêm filter cho cột này với operator và value đã chọn
            field.filterData.operator = selectFilterData.value.operator;
            field.filterData.value = selectFilterData.value.value;
            // Cập nhật columnFilters để lưu filter đã áp dụng
            addFilterToColumnFilters(field.key, field.filterType, field.label, selectFilterData.value.operator, getOperatorLabel(field.filterType, selectFilterData.value.value), selectFilterData.value.value);
        } else {
            selectFilterInput.value?.$el.querySelector('input')?.focus();
            filterMessage.value = 'Vui lòng chọn giá trị để áp dụng filter.';
            return;
        }
    }

    //Cách 2: Không kiểm tra xem value có rỗng hay không
    if (field.filterType === 'text') {

    } else if (field.filterType === 'number') {

    } else if (field.filterType === 'date') {

    } else if (field.filterType === 'select') {

    }

    await fetchDataPaging(pagingParams.value);
    closeFilterModal();

};

const clearFilter = () => {
    if (!currentFilterField.value) return;
    // Lấy field đang filter hiện tại
    const field = fields.find((f) => f.key === currentFilterField.value.key);
    if (!field) return;

    // Xóa filter cho cột này
    field.filterData!.operator = '';
    field.filterData!.value = '';

    // Xóa filter khỏi columnFilters
    removeFilterFromColumnFilters(field.key);
    clearFilterData();
};

const clearAllFilters = async () => {
    // Duyệt qua tất cả các field để xóa filter
    fields.forEach((field) => {
        if (field.filterData) {
            field.filterData.operator = '';
            field.filterData.value = '';
        }
    });
    // Xóa tất cả filter khỏi columnFilters
    columnFilters.value = [];
    clearFilterData();
    await fetchDataPaging(pagingParams.value);
};


const closeFilterModal = () => {
    filterModalVisible.value = false;
    currentFilterField.value = null;
    filterMessage.value = '';
};

// Khai báo biến lưu bộ đếm thời gian
let closeTimer: ReturnType<typeof setTimeout> | null = null;

// Hàm hủy đếm ngược (Giữ modal mở)
const clearCloseTimer = () => {
    if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }
};

const closeOnScroll = (event: Event) => {
    // Nếu modal đang không mở, không cần làm gì cả
    if (!filterModalVisible.value) return;

    // Lấy ra phần tử DOM đang xảy ra hành động cuộn
    const target = event.target as Node;

    // Nếu phần tử đang cuộn LÀ modal, hoặc NẰM BÊN TRONG modal -> BỎ QUA
    if (filterModalRef.value && filterModalRef.value.contains(target)) {
        return;
    }

    closeFilterModal();
};

// Hàm bắt đầu đếm ngược 500ms để đóng Modal
const startCloseTimer = () => {
    // Đảm bảo xóa timer cũ trước khi tạo timer mới để không bị chồng chéo
    clearCloseTimer();

    closeTimer = setTimeout(() => {
        filterModalVisible.value = false;
        currentFilterField.value = null;
    }, 500);
};

const showFilterModal = (payload: { field: any, event: MouseEvent }) => {
    clearCloseTimer();
    // 1. Lấy thẻ HTML vừa được click
    const targetEl = payload.event.currentTarget as HTMLElement;
    const viewportWidth = window.innerWidth;

    // 2. Lấy bộ tọa độ của thẻ đó trên màn hình (Viewport)
    const rect = targetEl.getBoundingClientRect();

    // 3. Tính toán vị trí cho Modal (Ví dụ cho Modal hiện ngay dưới nút filter)
    let modalTop = rect.bottom + 4; // Cách viền dưới nút 4px
    let modalLeft = rect.left - (filterModalWidth - rect.width) / 2; // Cố gắng căn giữa Modal với nút

    if (modalLeft + filterModalWidth > viewportWidth - 10) {
        // Lật Modal sang trái: Ép mép phải của Modal bằng với mép phải của Icon
        modalLeft = rect.right - filterModalWidth;
    }

    // Lưu vào biến state để bind vào style của Modal
    filterModalPosition.value = {
        top: `${modalTop}px`,
        left: `${modalLeft}px`,
        width: `${filterModalWidth}px`,
    };

    // Lưu thông tin field để biết đang filter cột nào
    currentFilterField.value = payload.field;
    // Duyệt columnFilters để tìm xem cột này đã có filter nào được áp dụng chưa, nếu có thì set giá trị đó vào các biến filterData để hiển thị trong Modal
    const existingFilter = columnFilters.value.find(f => f.key === payload.field.key);
    if (existingFilter) {
        if (currentFilterField.value.filterType === 'number') {
            numberFilterData.value.operator = existingFilter.operator;
            numberFilterData.value.value = existingFilter.value;
        } else if (currentFilterField.value.filterType === 'date') {
            dateFilterData.value.operator = existingFilter.operator;
            dateFilterData.value.value = existingFilter.value;
        } else if (currentFilterField.value.filterType === 'select') {
            selectFilterData.value.operator = existingFilter.operator;
            selectFilterData.value.value = existingFilter.value;
        } else {
            textFilterData.value.operator = existingFilter.operator;
            textFilterData.value.value = existingFilter.value;
        }
    } else {
        clearFilterData();
    }
    filterModalVisible.value = true;
};


onClickOutside(filterModalRef, (event) => {
    closeFilterModal();
});

const getDisplayValue = (filter: any) => {
    if (filter.type === 'select') {
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

onMounted(async () => {
    window.addEventListener('scroll', closeOnScroll, true);
    document.addEventListener('click', handleDocumentClick);
    await fetchDataPaging(pagingParams.value);
});

onBeforeUnmount(() => {

    document.removeEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
    window.removeEventListener('scroll', closeOnScroll, true);
});


//#endregion

</script>

<template lang="html">
    <div class="layout">
        <!-- Title -->
        <div class="title-box flex-row flex">
            <div class=" title-box__title">Ca làm việc</div>
            <MsButton class="" serverity="primary" @click="showAddEditShiftModal(null)">
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
                            @input="onSearchInput($event)" />
                        <div v-if="columnFilters.length > 0 && selectedRowIndices.length === 0"
                            class="filter-conditions h-full">
                            <div v-for="(filter, index) in columnFilters" :key="index" class="filter-item">
                                <div class="lable-value-filter">
                                    <span>{{ filter.fieldLabel }}</span>
                                    <span class="text-(--primary-color)">{{ filter.operatorLabel }}</span>
                                    <span>{{ getDisplayValue(filter) }}</span>
                                </div>
                                <div class="icon icon16 mi-warehouse close cursor-pointer"
                                    @click="removeFilterFromColumnFilters(filter.key)"></div>
                            </div>
                            <div class="hover:underline text-red-500 cursor-pointer" @click="clearAllFilters">
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
                            @click="fetchDataPaging(pagingParams)">
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
                            :selectedRowIndices="selectedRowIndices" @filter="showFilterModal($event)">
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
                                        @click="showAddEditShiftModal(row.shiftId)">
                                        <div class="icon icon16 mi-warehouse pencil group-hover:bg-(--primary-color)!"
                                            @click="">
                                        </div>
                                    </div>

                                    <div class="border border-gray-300 bg-white rounded-lg flex items-center justify-center w-6 h-6 cursor-pointer group relative"
                                        @mouseleave="closeMenu"
                                        @click.stop="toggleMenu(row.id); focusedRowIndex = rowIndex as number; console.log('Focused row index:', focusedRowIndex)">
                                        <div
                                            class="icon icon16 mi-warehouse feature-more-blue group-hover:bg-(--primary-color)! group relative">
                                        </div>
                                        <!-- Dropdown menu -->
                                        <div class="pt-5 absolute top-1 right-0 z-50">
                                            <div v-if="showMenuId === row.id" @click.stop=""
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
                                    :class="{ disabled: !canGoPrev }" @click="prevPage">
                                    <div class="icon angle-left mi-warehouse icon16 bg-gray-500!"></div>
                                </MsButton>
                                <MsButton class="p-1" serverity="secondary" variant="text" :disabled="!canGoNext"
                                    :class="{ disabled: !canGoNext }" @click="nextPage">
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
        <!-- Add/Edit shift Modal -->
        <MsModal :title="'ABC'" :visible="isAddEditShiftModalVisible" width="680px" height="auto">
            <template #header>
                <div class="form__popup__header__title">
                    <div class="form__popup__header__title__text">
                        {{ formShiftData.shiftId ? 'Sửa ca làm việc' : 'Thêm ca làm việc' }}
                    </div>
                </div>
                <div class="flex gap-2">
                    <div class="mi-warehouse icon20 ic-help cursor-pointer" @click="" v-tooltip.top="'Trợ giúp'">
                    </div>
                    <div class="mi-warehouse icon20 close cursor-pointer" @click="closeAddEditShiftModal()"
                        v-tooltip.top="'Đóng'">
                    </div>
                </div>

            </template>
            <template #body>
                <div class="w-full flex gap-4 items-center mb-[16px]">
                    <label class="w-[150px]">
                        Mã ca <span class="text-red-500">*</span>
                    </label>
                    <div class="flex-1">
                        <MsInput placeholder="Nhập mã ca làm việc" v-model="formShiftData.shiftCode" :minLength="1"
                            ref="shiftCodeInput" :maxLength="20"
                            @blur="formShiftData.shiftCode = formShiftData.shiftCode.trim(); validateShiftCode(formShiftData.shiftCode)"
                            :error="formShiftError.shiftCode" v-tooltip.bottom="formShiftError.shiftCode" />
                    </div>
                </div>
                <div class="w-full flex gap-4 items-center mb-[16px]">
                    <label class="w-[150px]">
                        Tên ca <span class="text-red-500">*</span>
                    </label>
                    <div class="flex-1">
                        <MsInput placeholder="Nhập tên ca làm việc" v-model="formShiftData.shiftName" :minLength="1"
                            @blur="formShiftData.shiftName = formShiftData.shiftName.trim(); validateShiftName(formShiftData.shiftName)"
                            ref="shiftNameInput" :maxLength="50" :error="formShiftError.shiftName"
                            v-tooltip.bottom="formShiftError.shiftName" />
                    </div>
                </div>

                <div class="w-full flex items-center mb-[16px]">
                    <div class="w-1/2 flex gap-4 items-center mr-3">
                        <label class="w-[150px]">
                            Giờ vào ca
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="flex-1 max-w-[122px]">
                            <MsDatepicker placeholder="HH:MM" v-model="formShiftData.shiftBeginTime!"
                                icon="mi-warehouse clock icon16" :type="'time'" ref="shiftBeginTimeInput"
                                @blur="validateShiftBeginTime(formShiftData.shiftBeginTime)"
                                @input="calculateShiftTimes" :error="formShiftError.shiftBeginTime"
                                v-tooltip.bottom="formShiftError.shiftBeginTime" />
                        </div>
                    </div>
                    <div class="w-1/2 flex gap-4 items-center">
                        <label class="w-[175px]">
                            Giờ hết ca
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="flex-1 max-w-[122px]">
                            <MsDatepicker placeholder="HH:MM" v-model="formShiftData.shiftEndTime!"
                                icon="mi-warehouse clock icon16" :type="'time'" ref="shiftEndTimeInput"
                                @blur="validateShiftEndTime(formShiftData.shiftEndTime)" @input="calculateShiftTimes"
                                :error="formShiftError.shiftEndTime" v-tooltip.bottom="formShiftError.shiftEndTime" />
                        </div>
                    </div>
                </div>
                <div class="w-full flex items-center mb-[16px]">
                    <div class="w-1/2 flex gap-4 items-center mr-3">
                        <label class="w-[150px]">
                            Bắt đầu nghỉ giữa ca
                        </label>
                        <div class="flex-1 max-w-[122px]">
                            <MsDatepicker ref="shiftBeginBreakTimeInput" placeholder="HH:MM"
                                v-model="formShiftData.shiftBeginBreakTime!" icon="mi-warehouse clock icon16"
                                :type="'time'" @blur="validateShiftBeginBreakTime(formShiftData.shiftBeginBreakTime)"
                                @input="calculateShiftTimes" :error="formShiftError.shiftBeginBreakTime"
                                v-tooltip.bottom="formShiftError.shiftBeginBreakTime" />
                        </div>
                    </div>
                    <div class="w-1/2 flex gap-4 items-center">
                        <label class="w-[175px]">
                            Kết thúc nghỉ giữa ca
                        </label>
                        <div class="flex-1 max-w-[122px]">
                            <MsDatepicker ref="shiftEndBreakTimeInput" placeholder="HH:MM"
                                v-model="formShiftData.shiftEndBreakTime!" icon="mi-warehouse clock icon16"
                                :type="'time'" @blur="validateShiftEndBreakTime(formShiftData.shiftEndBreakTime)"
                                @input="calculateShiftTimes" :error="formShiftError.shiftEndBreakTime"
                                v-tooltip.bottom="formShiftError.shiftEndBreakTime" />
                        </div>
                    </div>
                </div>
                <div class="w-full flex items-center mb-[16px]">
                    <div class="w-1/2 flex gap-4 items-center mr-3">
                        <label class="w-[150px]">
                            Thời gian làm việc (giờ)
                        </label>
                        <div class="flex-1 max-w-[122px]">
                            <MsInput textAlign="right" type="text" :readonly="true" :disabled="true"
                                :textColor="shiftWorkingTime.startsWith('(') ? 'text-red-500' : ''"
                                v-model="shiftWorkingTime" />
                        </div>
                    </div>
                    <div class="w-1/2 flex gap-4 items-center">
                        <label class="w-[175px]">
                            Thời gian nghỉ giữa ca (giờ)
                        </label>
                        <div class="flex-1 max-w-[122px]">
                            <MsInput textAlign="right" type="text" :readonly="true" :disabled="true"
                                v-model="shiftBreakingTime" />
                        </div>
                    </div>
                </div>

                <div class="w-full flex gap-4 items-start">
                    <label class="w-[150px]">
                        Mô tả
                    </label>
                    <div class="flex-1">
                        <MsTextArea placeholder="Nhập mô tả ca làm việc" :minLength="1" :maxLength="400" />
                    </div>
                </div>

                <div v-if="formShiftData.shiftId" class="w-full flex gap-4 items-start mt-[16px]">
                    <label class="w-[150px]">
                        Trạng thái
                    </label>
                    <div class="flex-1 flex items-center">
                        <label class="ms-radio mr-4">
                            <input type="radio" name="rdname" tabindex="0" value="true"
                                :checked="!formShiftData.shiftInactive" @change="formShiftData.shiftInactive = false">
                            <span class="checkmark"></span>
                            <div class="flex-column ms-radio-content">
                                <span class="ms-radio--text">Sử dụng</span>
                            </div>
                        </label>
                        <label class="ms-radio mr-4">
                            <input type="radio" name="rdname" tabindex="0" value="true"
                                :checked="formShiftData.shiftInactive" @change="formShiftData.shiftInactive = true">
                            <span class="checkmark"></span>
                            <div class="flex-column ms-radio-content">
                                <span class="ms-radio--text">Ngừng sử dụng</span>
                            </div>
                        </label>
                    </div>

                </div>



            </template>
            <template #footer>
                <MsButton class="cancel" @click="closeAddEditShiftModal" :label="'Hủy'" variant="outlined"
                    serverity="secondary">
                    Hủy
                </MsButton>
                <MsButton class="cancel" @click="handleSaveShift" :label="'Lưu và thêm'" variant="outlined"
                    serverity="secondary">
                    Lưu và thêm
                </MsButton>
                <MsButton class="submit" @click="handleSaveShift" :label="'Xác nhận'" serverity="primary">
                    Lưu
                </MsButton>
            </template>
        </MsModal>
        <!-- Confirm Modal -->
        <ModalConfirm :visible="isConfirmModalVisible" :title="confirmModalTitle" :message="confirmModalMessage"
            :variant="'danger'" @cancel="isConfirmModalVisible = false" @close="isConfirmModalVisible = false" @confirm="
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
        </ModalConfirm>
        <!-- Filter Modal -->
        <div ref="filterModalRef" class="condition-container gap-4" v-if="filterModalVisible"
            :style="filterModalPosition">
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <div class="column-filter-text mr-2">Lọc {{ currentFilterField.label.toLowerCase() }}</div>
                    <MsButton serverity="secondary" variant="text" @click="closeFilterModal">
                        <div class="icon icon16 close mi-warehouse"></div>
                    </MsButton>
                </div>
                <!-- Filter Options -->
                <div class="flex flex-col gap-2">
                    <!-- Text Filter -->
                    <div v-if="currentFilterField.filterType === 'text'">
                        <MsSelect placeholder="Chọn điều kiện" :options="textFilterOptions" class="w-full"
                            valueField="value" labelField="label" v-model="textFilterData.operator">
                        </MsSelect>
                        <MsInput ref="textFilterInput" placeholder="Nhập giá trị lọc" class="w-full mt-2"
                            :readonly="['isnull', 'isnotnull'].includes(textFilterData.operator)"
                            :modelValue="['isnull', 'isnotnull'].includes(textFilterData.operator) ? '' : textFilterData.value"
                            @update:modelValue="textFilterData.value = $event" :error="filterMessage"
                            v-tooltip.bottom="filterMessage" />
                    </div>
                    <!-- Number Filter -->
                    <div v-if="currentFilterField.filterType === 'number'">
                        <MsSelect placeholder="Chọn điều kiện" :options="numberFilterOptions" class="w-full"
                            valueField="value" labelField="label" v-model="numberFilterData.operator">
                        </MsSelect>
                        <MsInput ref="numberFilterInput" type="number" placeholder="Nhập giá trị lọc"
                            class="w-full mt-2" textAlign="right"
                            :readonly="['isnull', 'isnotnull'].includes(numberFilterData.operator)"
                            :modelValue="['isnull', 'isnotnull'].includes(numberFilterData.operator) ? '' : numberFilterData.value"
                            @update:modelValue="numberFilterData.value = $event" :error="filterMessage"
                            v-tooltip.bottom="filterMessage" />
                    </div>
                    <!-- Date Filter -->
                    <div v-if="currentFilterField.filterType === 'date'">
                        <MsSelect placeholder="Chọn điều kiện" :options="dateFilterOptions" class="w-full"
                            valueField="value" labelField="label" v-model="dateFilterData.operator">
                        </MsSelect>
                        <MsDatepicker ref="dateFilterInput" placeholder="Chọn ngày" class="w-full mt-2" :type="'date'"
                            :readonly="['isnull', 'isnotnull'].includes(dateFilterData.operator)"
                            :modelValue="['isnull', 'isnotnull'].includes(dateFilterData.operator) ? '' : dateFilterData.value"
                            @update:modelValue="dateFilterData.value = $event" :error="filterMessage"
                            v-tooltip.bottom="filterMessage" />
                    </div>
                    <!-- Select Filter -->
                    <div v-if="currentFilterField.filterType === 'select'">
                        <MsSelect ref="selectFilterInput" placeholder="Chọn giá trị lọc"
                            v-tooltip.bottom="filterMessage" :options="currentFilterField.selectOptions" class="w-full"
                            valueField="value" labelField="label" v-model="selectFilterData.value"
                            :error="filterMessage">
                        </MsSelect>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <MsButton serverity="secondary" class="bg-gray-100! hover:bg-gray-200!"
                            @click="clearFilter(); closeFilterModal()">
                            <div class=" text-(--text)">Bỏ lọc</div>
                        </MsButton>
                    </div>
                    <div class="flex items-center gap-x-2">
                        <MsButton serverity="secondary" variant="outlined" @click="closeFilterModal">
                            <div class=" text-(--text)">Hủy</div>
                        </MsButton>
                        <MsButton @click="applyFilter">
                            <div class="">Áp dụng</div>
                        </MsButton>
                    </div>
                </div>
            </div>
        </div>
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

.form__popup__header__title {
    flex: 1 1 0%;
    min-width: 0;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    line-height: 36px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;

    .form__popup__header__title__text {
        font-size: 16px;
        font-family: Inter;
        color: #000;
        margin-right: 0;
        white-space: nowrap;
        cursor: text;
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

input:checked~.checkmark {
    border-color: #0e9a62;
}

.ms-radio {
    position: relative;
    display: flex;
    align-items: center;
}

.ms-radio input {
    position: absolute;
    cursor: pointer;
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    margin: 0;
    padding: 0;
    opacity: 0;
}

.checkmark {
    display: inline-block;
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    position: relative;
    border: 1px solid #717680;
    background-color: #fff;
    cursor: pointer;
}

input:checked~.checkmark:before {
    content: "";
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #0e9a62;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.ms-radio-content {
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    padding-left: 8px;
}

.ms-radio:hover input:not(:disabled)+.checkmark {
    border-color: #0e9a62;
    box-shadow: 0 0 0 2px #0e9a62;
}

// Filter modal
.condition-container {
    padding: 16px;
    position: absolute;
    border: none;
    z-index: 1002;
    background: white;
    min-width: 350px;
    width: -moz-fit-content;
    width: fit-content;
    font-weight: 400;
    font-size: 13px;
    border-radius: 8px;
    box-shadow: 0 0 8px #0000001a, 0 8px 16px #0000001a;

    .column-filter-text {
        font-weight: 600;
        font-size: 16px;
        margin-right: 30px;
    }
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