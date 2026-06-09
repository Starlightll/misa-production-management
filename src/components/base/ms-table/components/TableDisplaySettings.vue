<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import MsInput from '../../ms-input/MsInput.vue';
import MsTableDefault from '../MsTableDefault.vue';
import MsButton from '../../ms-button/MsButton.vue';
import { useDraggable } from 'vue-draggable-plus';

const emit = defineEmits(['apply', 'cancel']);

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
    visible: {
        type: Boolean,
        default: false,
    },
    fields: {
        type: Array as any,
    },
    defaultFields: {
        type: Array as any,
    }
});

const allColumns = ref<any[]>([]);
const localColumns = ref<any[]>([]);

const editingColumnKey = ref<string | null>(null);
const tableCompRef = ref<any>(null);
const showInTableColumns = ref<string[]>([]);
const searchTerm = ref('');
const debounceTimeout = ref<number | null>(null);

// Hàm lọc dữ liệu từ mảng Master ra mảng hiển thị dựa theo từ khóa tìm kiếm
const filterColumns = () => {
    const term = searchTerm.value.trim().toLowerCase();
    if (term === '') {
        localColumns.value = [...allColumns.value];
    } else {
        localColumns.value = allColumns.value.filter(
            (col: any) => col.columnName.toLowerCase().includes(term) || col.columnDisplay.toLowerCase().includes(term)
        );
    }
    // Cập nhật mảng lưu các cột đang được tích chọn hiển thị trên table
    showInTableColumns.value = allColumns.value
        .filter((col: any) => col.columnVisible)
        .map((col: any) => col.columnKey);
};

// Khởi tạo dữ liệu từ props vào mảng Master ban đầu
watch(() => props.fields, (newFields) => {
    if (newFields) {
        const cols = newFields.filter((col: any) => col.exportable);
        const mappedCols = cols.map((col: any) => ({
            columnIndex: col.index,
            columnVisible: col.showInTable,
            columnKey: col.key,
            columnName: col.label,
            columnDisplay: col.label,
            columnPinned: col.pinned,
            columnWidth: col.style?.width.replace('px', '') || 'auto',
        }));

        // Sắp xếp ban đầu theo cấu hình hệ thống
        allColumns.value = mappedCols.sort((a: any, b: any) => {
            if (a.columnPinned && !b.columnPinned) return -1;
            if (!a.columnPinned && b.columnPinned) return 1;
            return a.columnIndex - b.columnIndex;
        });

        filterColumns();
    }
}, { immediate: true });

// Xử lý debounce khi gõ tìm kiếm cột
const handleDebounceSearch = () => {
    if (debounceTimeout.value) {
        clearTimeout(debounceTimeout.value);
    }
    debounceTimeout.value = window.setTimeout(() => {
        filterColumns();
    }, 300);
};

// XỬ LÝ GHIM CỘT DẠNG QUEUE (HÀNG ĐỢI) VÀ TRẢ VỀ THEO INDEX CŨ
const handlePinColumn = (row: any) => {
    row.columnPinned = !row.columnPinned;

    // Tìm vị trí hiện tại của cột trong mảng Master
    const currentIndex = allColumns.value.findIndex(c => c.columnKey === row.columnKey);
    if (currentIndex === -1) return;

    // Rút phần tử đó ra khỏi mảng
    allColumns.value.splice(currentIndex, 1);

    if (row.columnPinned) {
        // HÀNH VI QUEUE: Tìm vị trí của cột được ghim cuối cùng trong danh sách
        let lastPinnedIndex = -1;
        for (let i = allColumns.value.length - 1; i >= 0; i--) {
            if (allColumns.value[i].columnPinned) {
                lastPinnedIndex = i;
                break;
            }
        }
        // Chèn cột mới ghim vào ngay sau cột ghim cuối cùng (nếu chưa có ai ghim thì chèn lên đầu - vị trí 0)
        const insertIndex = lastPinnedIndex !== -1 ? lastPinnedIndex + 1 : 0;
        allColumns.value.splice(insertIndex, 0, row);
    } else {
        // HÀNH VI TRẢ VỀ: Tìm vị trí thích hợp trong vùng chưa ghim dựa theo columnIndex gốc tăng dần
        let lastPinnedIndex = -1;
        for (let i = allColumns.value.length - 1; i >= 0; i--) {
            if (allColumns.value[i].columnPinned) {
                lastPinnedIndex = i;
                break;
            }
        }
        const unpinnedStart = lastPinnedIndex + 1;

        let insertIndex = allColumns.value.length;
        for (let i = unpinnedStart; i < allColumns.value.length; i++) {
            if (allColumns.value[i].columnIndex > row.columnIndex) {
                insertIndex = i;
                break;
            }
        }
        allColumns.value.splice(insertIndex, 0, row);
    }

    // Làm mới lại danh sách hiển thị ra table
    filterColumns();
};

const handleSelectAll = () => {
    const isAllChecked = showInTableColumns.value.length === localColumns.value.length;
    localColumns.value.forEach((col: any) => {
        col.columnVisible = !isAllChecked;
    });
    filterColumns();
};

const handleSelectRow = (row: any) => {
    row.columnVisible = !row.columnVisible;
    filterColumns();
};

const columnDisplayRef = ref<HTMLElement | null>(null);

const handleApply = () => {
    // Trước khi apply, chốt lại quỹ columnIndex liền mạch dựa trên vị trí hiển thị cuối cùng của mảng Master
    const availableIndices = allColumns.value
        .map(c => c.columnIndex)
        .sort((a, b) => a - b);
    allColumns.value.forEach((col, index) => {
        col.columnIndex = availableIndices[index];
    });
    emit('apply', allColumns.value);
};

const resetToDefault = () => {
    const cols = props.defaultFields ? props.defaultFields.filter((col: any) => col.exportable) : [];
    console.log('Default columns:', cols);
    allColumns.value = cols.map((col: any) => ({
        columnIndex: col.index,
        columnVisible: col.showInTable,
        columnKey: col.key,
        columnName: col.label,
        columnDisplay: col.label,
        columnPinned: col.pinned,
        columnWidth: col.style?.width.replace('px', '') || 'auto',
    })).sort((a: any, b: any) => {
        if (a.columnPinned && !b.columnPinned) return -1;
        if (!a.columnPinned && b.columnPinned) return 1;
        return a.columnIndex - b.columnIndex;
    });
    searchTerm.value = '';
    filterColumns();
};

const handleCancel = () => {
    // Trả về trạng thái ban đầu của mảng Master trước khi có bất kỳ chỉnh sửa nào
    allColumns.value = props.fields.filter((col: any) => col.exportable).map((col: any) => ({
        columnIndex: col.index,
        columnVisible: col.showInTable,
        columnKey: col.key,
        columnName: col.label,
        columnDisplay: col.label,
        columnPinned: col.pinned,
        columnWidth: col.style?.width.replace('px', '') || 'auto',
    })).sort((a: any, b: any) => {
        if (a.columnPinned && !b.columnPinned) return -1;
        if (!a.columnPinned && b.columnPinned) return 1;
        return a.columnIndex - b.columnIndex;
    });
    searchTerm.value = '';
    emit('cancel');
};

const handleRowClick = (event: any) => {
    const columnKey = event.row.columnKey;
    if (editingColumnKey.value !== columnKey) {
        editingColumnKey.value = columnKey;
    }
    columnDisplayRef.value?.click();
};

const handleInput = (event: any, row: any, maxLength: number, type: 'columnDisplay' | 'columnWidth') => {
    let text = (event.target as HTMLElement).innerText.trim();
    if (type === 'columnWidth') {
        const regex = /^\d*$/;
        if (!regex.test(text)) {
            text = text.replace(/\D/g, '');
            (event.target as HTMLElement).innerText = text;
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(event.target as HTMLElement);
            range.collapse(false);
            sel!.removeAllRanges();
            sel!.addRange(range);
        }
    }
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        (event.target as HTMLElement).innerText = text;

        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(event.target as HTMLElement);
        range.collapse(false);
        sel!.removeAllRanges();
        sel!.addRange(range);
    }
};

const handleBlur = (event: FocusEvent, row: any, propName: 'columnDisplay' | 'columnWidth', maxLength: number) => {
    const target = event.target as HTMLElement;
    let text = target.innerText.trim();

    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        target.innerText = text;
    }

    row[propName] = text.trim();
};

onMounted(async () => {
    await nextTick();

    if (tableCompRef.value && tableCompRef.value.tbodyRef) {
        useDraggable(tableCompRef.value.tbodyRef, localColumns, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'opacity-50',
            onMove: (evt) => {
                if (evt.related && evt.related.querySelector('.pinned')) {
                    return false;
                }
            },
            onEnd: () => {
                // Nếu người dùng không thực hiện tìm kiếm, đồng bộ trực tiếp thứ tự kéo thả sang Master
                if (searchTerm.value.trim() === '') {
                    allColumns.value = [...localColumns.value];
                } else {
                    // Trường hợp đang search: Lọc và cập nhật vị trí tương đối
                    const currentFilteredKeys = localColumns.value.map(c => c.columnKey);
                    const unmanagedColumns = allColumns.value.filter(c => !currentFilteredKeys.includes(c.columnKey));

                    // Tìm vị trí bắt đầu của các cột chưa ghim để chèn danh sách vừa kéo thả vào đúng phân vùng
                    let lastPinnedIndex = -1;
                    for (let i = unmanagedColumns.length - 1; i >= 0; i--) {
                        if (unmanagedColumns[i].columnPinned) {
                            lastPinnedIndex = i;
                            break;
                        }
                    }
                    const insertIdx = lastPinnedIndex !== -1 ? lastPinnedIndex + 1 : 0;

                    // Tái cấu trúc lại mảng Master hoàn chỉnh
                    allColumns.value = [
                        ...unmanagedColumns.slice(0, insertIdx),
                        ...localColumns.value,
                        ...unmanagedColumns.slice(insertIdx)
                    ];
                }

                // Cập nhật lại quỹ index (Index Pooling) trên mảng Master
                const availableIndices = allColumns.value
                    .map(c => c.columnIndex)
                    .sort((a, b) => a - b);

                allColumns.value.forEach((col, index) => {
                    col.columnIndex = availableIndices[index];
                });

                filterColumns();
            }
        });
    }
});
</script>

<template>
    <div class="table-display-settings-container" :class="{ 'visible': visible }" @click.stop>
        <!-- Backdrop -->
        <div class="backdrop"></div>
        <!-- Content -->
        <div class="content" :class="[visible ? 'animate-slide-in-right' : 'animate-slide-out-right']" @click.stop>
            <!-- Header -->
            <div class="content__header">
                <!-- Header left -->
                <div class="content__header__left">
                    <div class="content__header__left__title">Tùy chỉnh giao diện</div>
                </div>
                <!-- Header right -->
                <div class="content__header__right">
                    <div class="icon mi-warehouse icon20 ic-help"></div>
                    <div class="icon mi-warehouse icon20 close cursor-pointer" @click="handleCancel"></div>
                </div>
            </div>
            <!-- Body -->
            <div class="content__body">
                <MsInput label="Tìm kiếm cột" placeholder="Tìm kiếm" class="w-58" v-model="searchTerm"
                    @input="handleDebounceSearch" :icon="'mi-warehouse icon16 icon left search'">
                </MsInput>
                <div class="mt-2 border rounded overflow-hidden w-full border-(--color-border) ">
                    <MsTableDefault ref="tableCompRef" :fields="fields" :rows="localColumns"
                        @row-click="handleRowClick($event)">
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
            <div data-v-1a2e94a9="" class="modal__footer__line"></div>
            <!-- Footer -->
            <div class="content__footer">
                <!-- Left -->
                <div>
                    <MsButton variant="outlined" :serverity="'secondary'" @click="resetToDefault()">Lấy lại mặc định
                    </MsButton>
                </div>
                <!-- Right -->
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