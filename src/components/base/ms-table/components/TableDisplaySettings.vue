<script setup lang="ts">
import { ref, watch } from 'vue';
import MsInput from '../../ms-input/MsInput.vue';
import MsTableDefault from '../MsTableDefault.vue';
import MsButton from '../../ms-button/MsButton.vue';
import { useTableDisplaySettings } from '../../../../composables/useTableDisplaySettings.ts'; // Import Composable vừa tạo

const emit = defineEmits(['apply', 'cancel']);

// Cấu hình headers hiển thị cố định của bản thân Modal cài đặt giao diện
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
            position: "sticky", left: 0, zIndex: 5, width: '50px', minWidth: "50px", maxWidth: "50px",
        },
    },
    { key: 'columnName', label: 'Tên cột dữ liệu', style: { width: '200px' } },
    { key: 'columnDisplay', label: 'Tên cột hiển thị', type: 'custom' },
    { key: 'columnWidth', label: 'Độ rộng', type: 'custom', align: 'right', style: { width: '120px' } },
    { key: 'Action', label: 'Ghim cột', type: 'custom', style: { width: '90px' } },
]);

const props = defineProps({
    visible: { type: Boolean, default: false },
    fields: { type: Array as any },
    defaultFields: { type: Array as any }
});

// Các template DOM reference cần thiết
const tableCompRef = ref<any>(null);
const columnDisplayRef = ref<any>(null);

// Áp dụng Composable
const {
    localColumns,
    searchTerm,
    showInTableColumns,
    handleDebounceSearch,
    handlePinColumn,
    handleSelectAll,
    handleSelectRow,
    getAppliedColumns,
    resetToDefault,
    resetToOriginalProps,
    handleRowClick,
    handleInput,
    handleBlur
} = useTableDisplaySettings({ props, tableCompRef });


//Update data khi mở modal
watch(() => props.visible, (newVal) => {
    if (newVal) {
        // Khi mở modal, reset dữ liệu cột về trạng thái hiện tại của bảng
        resetToOriginalProps();
    }
});

// Wrap các hàm tương tác nút bấm để emit ra bên ngoài màn hình cha
const handleApply = () => {
    const dataToApply = getAppliedColumns();
    emit('apply', dataToApply);
};

const handleCancel = () => {
    resetToOriginalProps();
    emit('cancel');
};
</script>

<template>
    <div class="table-display-settings-container" :class="{ 'visible': visible }" @click.stop>
        <div class="backdrop"></div>
        <div class="content" :class="[visible ? 'animate-slide-in-right' : 'animate-slide-out-right']" @click.stop>
            <div class="content__header">
                <div class="content__header__left">
                    <div class="content__header__left__title">Tùy chỉnh giao diện</div>
                </div>
                <div class="content__header__right">
                    <div class="icon mi-warehouse icon20 ic-help" v-tooltip.bottom="'Trợ giúp'"></div>
                    <div class="icon mi-warehouse icon20 close cursor-pointer" @click="handleCancel"
                        v-tooltip.bottom="'Đóng'"></div>
                </div>
            </div>
            <div class="content__body flex flex-col">
                <MsInput label="Tìm kiếm cột" placeholder="Tìm kiếm" class="w-58" v-model="searchTerm"
                    @input="handleDebounceSearch" :icon="'mi-warehouse icon16 icon left search'">
                </MsInput>
                <div class="mt-2 mb-4 border rounded overflow-hidden w-full border-(--color-border) flex-1 ">
                    <MsTableDefault ref="tableCompRef" :fields="fields" :rows="localColumns"
                        :defaultFields="defaultFields">
                        <template #title-Checkbox="{ }">
                            <MsCheckbox type="checkbox" style="width: 16px; height: 16px" @change="handleSelectAll"
                                :modelValue="showInTableColumns.length === localColumns.length" />
                        </template>
                        <template #Checkbox="{ row }">
                            <MsCheckbox type="checkbox" style="width: 16px; height: 16px" @change="handleSelectRow(row)"
                                :modelValue="showInTableColumns.includes(row.columnKey)" />
                        </template>
                        <template #columnDisplay="{ row }">
                            <div contenteditable="true" @input="handleInput($event, row, 50, 'columnDisplay')"
                                @blur="handleBlur($event, row, 'columnDisplay', 50)"
                                class="overflow-auto scrollbar-none p-1 flex items-center gap-2 border-2 border-transparent hover:border-gray-300 rounded-lg focus:outline-none focus:border-(--primary-color) w-full!">
                                {{ row.columnDisplay }}
                            </div>
                        </template>
                        <template #columnWidth="{ row }">
                            <div contenteditable="true" @input="handleInput($event, row, 3, 'columnWidth')"
                                @blur="handleBlur($event, row, 'columnWidth', 3)"
                                class="overflow-auto scrollbar-none p-1 flex justify-end items-center gap-2 border-2 border-transparent hover:border-gray-300 rounded-lg focus:outline-none focus:border-(--primary-color) w-full!">
                                {{ row.columnWidth }}
                            </div>
                        </template>
                        <template #Action="{ row }">
                            <div class="flex items-center justify-between gap-2 w-full h-full ">
                                <div class="flex items-center justify-center w-6 h-6 cursor-pointer group"
                                    v-tooltip.left="'Ghim cột'">
                                    <div class="icon icon16 mi-warehouse group-hover:bg-(--primary-color)!"
                                        :class="row.columnPinned ? 'pinned bg-(--primary-color)!' : 'pin-italic '"
                                        @click="handlePinColumn(row)">
                                    </div>
                                </div>
                                <div class=" flex items-center justify-center w-6 h-6 cursor-grab active:cursor-grabbing group"
                                    :class="[row.columnPinned ? 'pointer-events-none disabled' : 'drag-handle']">
                                    <div class="icon icon16 mi-warehouse drag group-hover:bg-(--primary-color)!"></div>
                                </div>
                            </div>
                        </template>
                    </MsTableDefault>
                </div>
            </div>
            <div class="modal__footer__line"></div>
            <div class="content__footer">
                <div>
                    <MsButton variant="outlined" :serverity="'secondary'" @click="resetToDefault()">Lấy lại mặc định
                    </MsButton>
                </div>
                <div>
                    <MsButton variant="outlined" :serverity="'secondary'" @click="handleCancel">Hủy</MsButton>
                    <MsButton @click="handleApply" class="ml-2">Lưu</MsButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.table-display-settings-container {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    /* Đảm bảo nó nằm trên các phần tử khác */
    transition: opacity 0.3s ease;

    &.visible {
        opacity: 1;
        pointer-events: auto;
    }

    .content {
        width: 800px;
        background-color: #fff;
        height: 100%;
        position: absolute;
        right: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;

        &__header {
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &__left {
                flex: 1 1 0%;
                min-width: 0;
                align-items: center;
                font-weight: 700;
                font-size: 16px;
                line-height: 36px;
                text-overflow: ellipsis;
                overflow: hidden;
                display: flex;

                &__title {
                    font-size: 20px;
                    color: #000;
                    margin-right: 0;
                    white-space: nowrap;
                    cursor: text;
                    font-weight: 700;
                }
            }

            &__right {
                display: flex;
                align-items: center;
                -moz-column-gap: 8px;
                column-gap: 8px;
                justify-content: flex-end;
                white-space: nowrap;
                flex-shrink: 0;
            }
        }

        &__body {
            flex: 1;
            padding: 0 20px;
        }

        &__footer {
            display: flex;
            padding: 12px 20px;
            position: relative;
            justify-content: space-between;
        }

        .modal__footer__line {
            border-top: 1px solid #D5D7DA;
        }
    }
}

.backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>