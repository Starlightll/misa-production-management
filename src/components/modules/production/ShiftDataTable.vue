<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import MsInput from '../../base/ms-input/MsInput.vue';
import MsButton from '../../base/ms-button/MsButton.vue';
import MsTableDefault from '../../base/ms-table/MsTableDefault.vue';
import MsSelect from '../../base/ms-select/MsSelect.vue';
import MsCheckbox from '../../base/ms-checkbox/MsCheckbox.vue';
const currentSize = ref('10');
const tableSizeOptions = [
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
    }];

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
        key: 'ShiftCode', label: 'Mã ca', type: "text", resizable: true, filterable: true,
        style: {
            width: '120px',
        },
    },
    {
        key: 'ShiftName', label: 'Tên ca', type: "text", resizable: true, filterable: true,
        style: {
            width: '250px',
        },
    },
    {
        key: 'ShiftBeginTime', label: 'Giờ vào ca', type: "text", resizable: true, filterable: false,
        style: {
            width: '130px',
        },
    },
    {
        key: 'ShiftEndTime', label: 'Giờ hết ca', type: "text", resizable: true, filterable: false,
        style: {
            width: '130px',
        },
    },
    {
        key: 'ShiftBeginBreakTime', label: 'Bắt đầu nghỉ giữa ca', type: "text", resizable: true, filterable: false,
        style: {
            width: '200px',
        },
    },
    {
        key: 'ShiftEndBreakTime', label: 'Kết thúc nghỉ giữa ca', type: "text", resizable: true, filterable: false,
        style: {
            width: '210px',
        },
    },
    {
        key: 'ShiftWorkingTime', label: 'Thời gian làm việc (giờ)', type: 'number', resizable: true, filterable: true,
        style: {
            width: '210px',
        },
    },
    {
        key: 'ShiftBreakingTime', label: 'Thời gian nghỉ giữa ca (giờ)', type: "text", resizable: true, filterable: true,
        style: {
            width: '230px',
        },
    },
    {
        key: 'ShiftInactive', label: 'Trạng thái', type: 'custom', resizable: true, filterable: true,
        style: {
            width: '230px',
        },
    },
    {
        key: 'CreatedBy', label: 'Người tạo', type: "text", resizable: true, filterable: true,
        style: {
            width: '200px',
        },
    },
    {
        key: 'CreatedDate', label: 'Ngày tạo', type: "date", resizable: true, filterable: true,
        style: {
            width: '160px',
        },
    },
    {
        key: 'ModifiedBy', label: 'Người sửa', type: "text", resizable: true, filterable: true,
        style: {
            width: '160px',
        },
    },
    {
        key: 'ModifiedDate', label: 'Ngày sửa', type: "date", resizable: true, filterable: true,
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

const rows = [
    { id: '1', ShiftCode: 'S1', ShiftName: 'Ca sáng', ShiftBeginTime: '08:00', ShiftEndTime: '16:00', ShiftBeginBreakTime: '12:00', ShiftEndBreakTime: '13:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-01', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-01', ShiftWorkingTime: 8 },
    { id: '2', ShiftCode: 'S2', ShiftName: 'Ca chiều', ShiftBeginTime: '16:00', ShiftEndTime: '24:00', ShiftBeginBreakTime: '20:00', ShiftEndBreakTime: '21:00', ShiftInactive: true, CreatedBy: 'John Doe', CreatedDate: '2023-01-02', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-02', ShiftWorkingTime: 8 },
    { id: '3', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
    { id: '4', ShiftCode: 'S4', ShiftName: 'Ca đêm', ShiftBeginTime: '08:00', ShiftEndTime: '16:00', ShiftBeginBreakTime: '12:00', ShiftEndBreakTime: '13:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-04', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-04', ShiftWorkingTime: 8 },
    { id: '5', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
    { id: '6', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
    { id: '7', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
    { id: '8', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
    { id: '9', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
    { id: '10', ShiftCode: 'S3', ShiftName: 'Ca tối', ShiftBeginTime: '24:00', ShiftEndTime: '08:00', ShiftBeginBreakTime: '04:00', ShiftEndBreakTime: '05:00', ShiftInactive: false, CreatedBy: 'John Doe', CreatedDate: '2023-01-03', ModifiedBy: 'John Doe', ModifiedDate: '2023-01-03', ShiftWorkingTime: 8 },
];

const disableMouseEvent = ref(false);
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



onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick);
});

</script>

<template lang="html">
    <!-- Data Table -->
    <div class="table-container">
        <!-- toolbar -->
        <div class="table-container__toolbar flex-row flex justify-between items-center">
            <!-- Left -->
            <div class="table-container__toolbar__left">
                <MsInput class="w-[240px]" placeholder="Tìm kiếm..." icon="mi-warehouse icon16 icon left search" />
            </div>
            <!-- Right -->
            <div class="table-container__toolbar__right">
                <MsButton class="" severity="secondary" variant="outlined">
                    <div class="icon reload mi-warehouse icon16 bg-gray-600!"></div>
                </MsButton>
            </div>
        </div>
        <!-- Table grid -->
        <div class="table-container__table">
            <div class="table-container__table__content">
                <MsTableDefault :fields="fields" :rows="rows" :focusedRowIndex="focusedRowIndex">
                    <template #title-Checkbox="{ }">
                        <MsCheckbox type="checkbox" style="width: 16px; height: 16px" />
                    </template>
                    <template #Checkbox="{ row }">
                        <MsCheckbox type="checkbox" style="width: 16px; height: 16px" />
                    </template>
                    <template #ShiftInactive="{ row }">
                        <!-- Active -->
                        <div v-if="!row.ShiftInactive" class="qtsx-grid-status-tag active">
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
                            <div class="border border-gray-300 rounded-lg flex items-center justify-center w-6 h-6 cursor-pointer group"
                                @click="">
                                <div class="icon icon16 mi-warehouse pencil group-hover:bg-(--primary-color)!"
                                    @click="">
                                </div>
                            </div>

                            <div class="border border-gray-300 rounded-lg flex items-center justify-center w-6 h-6 cursor-pointer group relative"
                                @click.stop="toggleMenu(row.id); focusedRowIndex = rowIndex as number; console.log('Focused row index:', focusedRowIndex)">
                                <div
                                    class="icon icon16 mi-warehouse feature-more-blue group-hover:bg-(--primary-color)! group relative">
                                </div>
                                <!-- Dropdown menu -->
                                <div v-if="showMenuId === row.id" @click.stop="" @mouseleave="closeMenu"
                                    class="mt-1 w-32 bg-white rounded-lg absolute top-full right-0 z-50 overflow-hidden p-2 shadow-gray-300 "
                                    style="box-shadow: 0 0 8px #0000001a, 0 8px 16px #0000001a;">
                                    <div class="px-3 py-2 hover:bg-gray-100 rounded-sm cursor-pointer flex whitespace-nowrap items-center gap-2"
                                        @click="closeMenu">
                                        <div class="icon icon16 mi-warehouse duplicate"></div>
                                        <div>Nhân bản</div>
                                    </div>
                                    <div class="px-3 py-2 hover:bg-gray-100 rounded-sm cursor-pointer flex whitespace-nowrap items-center gap-2"
                                        @click="closeMenu">
                                        <div class="icon icon16 mi-warehouse active"></div>
                                        <div>Sử dụng</div>
                                    </div>
                                    <div class="px-3 py-2 hover:bg-gray-100 rounded-sm cursor-pointer flex whitespace-nowrap items-center gap-2"
                                        @click="closeMenu">
                                        <div class="icon icon16 mi-warehouse trash"></div>
                                        <div>Xóa</div>
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
                    <span>Tổng số: <span class="font-bold">19</span></span>
                </div>
            </div>
            <!-- Right -->
            <div>
                <div class="flex items-center gap-x-4">
                    <span class="whitespace-nowrap">Số dòng/trang</span>
                    <MsSelect name="area" placeholder="Chọn khu vực" id="areaSelect" :options="tableSizeOptions"
                        class="w-20!" valueField="value" labelField="label" v-model="currentSize">
                    </MsSelect>
                    <span class="font-bold">1 - 19</span>
                    <!-- Pagination controls -->
                    <div class="flex">
                        <MsButton class="p-1 disabled" severity="secondary" variant="text">
                            <div class="icon step-backward mi-warehouse icon16 bg-gray-500!"></div>
                        </MsButton>
                        <MsButton class="p-1 disabled" severity="secondary" variant="text">
                            <div class="icon angle-left mi-warehouse icon16 bg-gray-500!"></div>
                        </MsButton>
                        <MsButton class="p-1 disabled" severity="secondary" variant="text">
                            <div class="icon angle-right mi-warehouse icon16 bg-gray-500!"></div>
                        </MsButton>
                        <MsButton class="p-1 disabled" severity="secondary" variant="text">
                            <div class="icon step-forward mi-warehouse icon16 bg-gray-500!"></div>
                        </MsButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
</style>