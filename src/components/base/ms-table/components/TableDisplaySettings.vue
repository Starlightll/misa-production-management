<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MsInput from '../../ms-input/MsInput.vue';
import MsTableDefault from '../MsTableDefault.vue';
import MsButton from '../../ms-button/MsButton.vue';

const emit = defineEmits(['apply']);

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
        key: 'columnName',
        label: 'Tên cột dữ liệu',
        style: {
            width: '200px',
        },
    },
    {
        key: 'columnDisplay',
        label: 'Tên cột hiển thị',
        type: 'custom',
    },
    {
        key: 'columnWidth',
        label: 'Độ rộng',
        type: 'custom',
        align: 'right',
        style: {
            width: '120px',
        },
    },
    {
        key: 'Action',
        label: 'Ghim cột',
        type: 'custom',
        style: {
            width: '90px',
        },
    },
]);


const props = defineProps({
    // Các props cần thiết cho component
    rows: {
        type: Array as any,
    },
});

const editingColumnKey = ref<string | null>(null);

const columns = computed(() => {
    const cols = props.rows.filter((col: any) => col.exportable);
    return cols.map((col: any) => ({
        columnVisible: col.showInTable,
        columnKey: col.key,
        columnName: col.label,
        columnDisplay: col.label,
        columnPinned: col.pinned,
        columnWidth: col.style?.width.replace('px', '') || 'auto',
    }));
});

const showInTableColumns = ref<string[]>([]);

const handleSelectAll = () => {
    if (showInTableColumns.value.length === columns.value.length) {
        showInTableColumns.value = [];
    } else {
        showInTableColumns.value = columns.value.map((col: any) => col.columnKey);
    }
};

const handleSelectRow = (row: any) => {
    const columnIndex = columns.value.findIndex((c: any) => c.columnKey === row.columnKey);
    if (showInTableColumns.value.includes(columns.value[columnIndex].columnKey)) {
        showInTableColumns.value = showInTableColumns.value.filter(key => key !== columns.value[columnIndex].columnKey);
    } else {
        showInTableColumns.value.push(columns.value[columnIndex].columnKey);
    }
};

const columnDisplayRef = ref<HTMLElement | null>(null);

const handleApply = () => {
    emit('apply', columns.value);
};

const handleRowClick = (event: any) => {
    const columnKey = event.row.columnKey;
    if (editingColumnKey.value === columnKey) {
    } else {
        editingColumnKey.value = columnKey;
    }
    columnDisplayRef.value?.click();
};

// const handleKeydown = (event: KeyboardEvent) => {
//     const target = event.target as HTMLElement;
//     const isControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key);

//     if (target.innerText.trim().length >= 5 && !isControlKey) {
//         event.preventDefault(); // Chặn hành vi gõ tiếp
//     }
// };

const handleInput = (event: any, row: any, maxLength: number) => {
    let text = (event.target as HTMLElement).innerText.trim();

    // Chỉ lấy tối đa 5 ký tự đầu tiên
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        (event.target as HTMLElement).innerText = text; // Cập nhật lại giao diện

        // Đưa con trỏ chuột về cuối dòng (tránh bị nhảy con trỏ lên đầu)
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(event.target as HTMLElement);
        range.collapse(false);
        sel!.removeAllRanges();
        sel!.addRange(range);
    }

    // Cập nhật giá trị vào data của bạn
    row.columnWidth = text;
};

onMounted(() => {
    showInTableColumns.value = columns.value.filter((col: any) => col.columnVisible).map((col: any) => col.columnKey);
});


</script>

<template>
    <div class="table-display-settings-container" @click.stop>
        <!-- Backdrop -->
        <div class="backdrop"></div>
        <!-- Content -->
        <div class="content">
            <!-- Header -->
            <div class="content__header">
                <!-- Header left -->
                <div class="content__header__left">
                    <div class="content__header__left__title">Tùy chỉnh giao diện</div>
                </div>
                <!-- Header right -->
                <div class="content__header__right">
                    <div class="icon mi-warehouse icon20 ic-help"></div>
                    <div class="icon mi-warehouse icon20 close"></div>
                </div>
            </div>
            <!-- Body -->
            <div class="content__body">
                <MsInput label="Tìm kiếm cột" placeholder="Tìm kiếm" class="w-58"
                    :icon="'mi-warehouse icon16 icon left search'">
                </MsInput>
                <div class="mt-2 border rounded overflow-hidden w-full border-(--color-border) ">
                    <MsTableDefault :fields="fields" :rows="columns" @row-click="handleRowClick($event)">
                        <template #title-Checkbox="{ }">
                            <MsCheckbox type="checkbox" style="width: 16px; height: 16px" @change="handleSelectAll"
                                :modelValue="showInTableColumns.length === columns.length" />
                        </template>
                        <template #Checkbox="{ row }">
                            <MsCheckbox type="checkbox" style="width: 16px; height: 16px" @change="handleSelectRow(row)"
                                :modelValue="showInTableColumns.includes(row.columnKey)" />
                        </template>
                        <template #columnDisplay="{ row }">
                            <div contenteditable="true" @input="handleInput($event, row, 50)"
                                class="overflow-auto scrollbar-none p-1 flex items-center gap-2 border-2 border-transparent hover:border-gray-300 rounded-lg focus:outline-none focus:border-(--primary-color) w-full!">

                                {{ row.columnDisplay }}

                            </div>
                        </template>
                        <template #columnWidth="{ row }">
                            <div contenteditable="true" @input="handleInput($event, row, 5)"
                                class="overflow-auto scrollbar-none p-1 flex justify-end items-center gap-2 border-2 border-transparent
                                hover:border-gray-300 rounded-lg focus:outline-none focus:border-(--primary-color) w-full!">
                                {{ row.columnWidth }}
                            </div>
                        </template>
                        <template #Action="{ row }">
                            <div class="flex items-center justify-between gap-2 w-full h-full ">
                                <div class="  flex items-center justify-center w-6 h-6 cursor-pointer group" @click="">
                                    <div class="icon icon16 mi-warehouse group-hover:bg-(--primary-color)!"
                                        :class="row.columnPinned ? 'pinned bg-(--primary-color)!' : 'pin-italic '"
                                        @click="">
                                    </div>
                                </div>

                                <div class="  flex items-center justify-center w-6 h-6 cursor-grab group" @click="">
                                    <div class="icon icon16 mi-warehouse drag group-hover:bg-(--primary-color)!"
                                        @click="">
                                    </div>
                                </div>
                            </div>
                        </template>
                    </MsTableDefault>
                </div>
            </div>
            <div data-v-1a2e94a9="" class="modal__footer__line"></div>
            <!-- Footer -->
            <div class="content__footer">
                <!-- Left -->
                <div>
                    <MsButton variant="outlined" :serverity="'secondary'">Lấy lại mặc định</MsButton>
                </div>
                <!-- Right -->
                <div>
                    <MsButton variant="outlined" :serverity="'secondary'">Hủy</MsButton>
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
    /* Đảm bảo nó nằm trên các phần tử khác */

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
}
</style>