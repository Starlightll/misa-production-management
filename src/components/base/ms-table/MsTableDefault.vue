<template lang="html">
    <div class=" w-full h-full relative">
        <div v-if="isLoading" class="z-101 loading-icon absolute items-center justify-center">
            <div class="misa-amis w-14 h-14 animate-spin"></div>
        </div>
        <div v-if="!isLoading && rows.length === 0"
            class="grid-no-data absolute  bg-white/10 flex items-center justify-center z-20">
            <div class="ic-report-nodata text-center">
                <img src="../../../assets/icons/bg_report_nodata.svg" alt="No data" />
                <div>Không có dữ liệu</div>
            </div>
        </div>
        <div ref="tableRef" class="w-full h-full overflow-auto scrollbar-thin relative">
            <table class="ms-table">
                <thead class="ms-thead bg-(--bg-semi-dark)">
                    <tr>
                        <th v-for="(field, index) in visibleFields" :key="field.key" :style="field.thStyle || {}"
                            scope="col" @click.stop="handleColumnHeaderClick(field, $event)" class="ms-col-th">
                            <div class="title-wrapper" :style="[
                                index === visibleFields.length - 1 ? 'border-right: none !important;' : '',
                            ]">
                                <!-- Title -->
                                <div class="title">
                                    <!-- Pin icon -->
                                    <div class="icon pin mi-warehouse icon16 bg-gray-600!"
                                        :class="pinnedMap[field.key] ? 'pinned' : ''"></div>
                                    <!-- Text -->
                                    <div class="flex-1 flex items-center gap-2" :class="[
                                        field.align === 'center' ? 'text-center! justify-center!' : field.align === 'right' ? 'text-end! justify-end!' : field.align === 'left' ? 'text-start! justify-start!' :
                                            field.type === 'number' ? 'text-end! justify-end!' : field.type === 'date' ? 'text-center! justify-center!' : field.type === 'time' ? 'text-start! justify-start!' : field.type === 'text' ? 'text-left! justify-start!' : 'text-start! justify-start!',
                                    ]">
                                        <template v-if="field.type === 'custom'">
                                            <slot :name="`title-${field.key}`" :field="field">
                                                {{ field.displayLabel || field.label }}
                                            </slot>
                                        </template>
                                        <template v-else>
                                            <div :style="{
                                                maxWidth: field.style?.width ? `calc(${field.style.width} - ${sortsMap[field.key] ? '64px' : '32px'}) ` : 'calc(100% - 32px)',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                            }">
                                                {{ field.displayLabel || field.label }}
                                            </div>
                                        </template>
                                        <!-- Sort icon -->
                                        <div v-if="field.sortable"
                                            :class="sortsMap[field.key] ? (sortsMap[field.key] === 'asc' ? 'arrow-up' : 'arrow-down') : 'unsorted'"
                                            class="icon sort mi-warehouse arrow-up icon16 bg-gray-600!"></div>
                                    </div>

                                </div>
                                <!-- Filter icon -->
                                <div v-if="field.filter?.filterable" class="flex items-center bg-[#F3F4F6]" :style="{
                                    position: 'absolute',
                                    right: '10px',
                                }">
                                    <div class="icon mi-warehouse icon16 bg-gray-600!"
                                        :class="field.filter?.filterData.value ? 'filtered filter--active' : 'filter'"
                                        @click.stop="handleFilterClick(field, $event)"></div>
                                </div>

                            </div>

                            <!-- Resizer -->
                            <div v-if="field.resizable" class="resizer"></div>
                        </th>
                    </tr>
                </thead>

                <tbody ref="tbodyRef" class="ms-tbody bg-white divide-y divide-gray-200">
                    <div v-if="isLoading" overlay class="z-100 bg-white/50 absolute inset-0 w-full h-full"></div>
                    <template v-if="rows.length > 0">
                        <tr v-for="(row, index) in rows" :key="index" class="ms-tr"
                            @click="emit('row-click', { row, rowIndex: index })" :class="[index == props.focusedRowIndex ? 'z-10!' : '', props.selectedItems.some((item: any) => item[props.rowKey] === row[props.rowKey]) ? 'row-selected' : '',
                            ]">
                            <td v-for="(field, index) in visibleFields" :key="field.key" :style="field.tdStyle || {}"
                                class="ms-col-td">
                                <div class="flex items-center h-full">
                                    <div class="flex flex-1 px-4" :class="[
                                        field.align === 'center' ? 'text-center! justify-center!' : field.align === 'right' ? 'text-end! justify-end!' : field.align === 'left' ? 'text-start! justify-start!' :
                                            field.type === 'number' ? 'text-end! justify-end!' : field.type === 'date' ? 'text-center! justify-center!' : field.type === 'time' ? 'text-start! justify-start!' : field.type === 'text' ? 'text-left! justify-start!' : 'text-start! justify-start!',
                                        field.displayOnHover ? 'display-on-hover' : '',

                                    ]">
                                        <!-- Custom type with slot -->
                                        <template v-if="field.type === 'custom'">
                                            <!-- <div v-if="field.displayOnHover" class="display-on-hover">
                                    <slot :name="field.key" :row="row" :field="field" :value="row[field.key]">
                                        {{ handleFormat(row[field.key], "text") }}
                                    </slot>
                                        </div> -->
                                            <slot :name="field.key" :row="row" :rowIndex="index" :field="field"
                                                :value="row[field.key]">
                                                <div class="">{{ handleFormat(row[field.key], "text") }}</div>
                                            </slot>
                                        </template>

                                        <!-- Other types -->
                                        <template v-else>
                                            <div class="text-ellipsis overflow-hidden whitespace-nowrap">{{
                                                handleFormat(row[field.key], field.type || "text") }}</div>
                                        </template>
                                    </div>
                                    <div class="h-full"
                                        :class="[index === lastPinnedColumnIndex && field.pinned ? 'border-r-2 border-(--border)' : '']">
                                    </div>
                                </div>

                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <!-- Filter Popover -->
            <div ref="filterPopoverRef" v-if="currentFilterField" class="filter-modal" :style="filterModalStyle"
                @click.stop>
                <TableColumnFilter :field="currentFilterField" @remove-filter="" @apply="handleApplyFilter"
                    @clear="handleClearFilter($event)" @close="handleCloseFilter" />
            </div>
            <!-- Column Sort Popover -->
            <ul ref="sortPopoverRef" v-if="currentSortField" class="sort-modal " :style="columnSortStyle" @click.stop>
                <li class="menu-wrapper-item" @click="handleSort('')">
                    <div class="icon icon16 mi-warehouse empty"></div>
                    Không sắp xếp
                </li>
                <li class="menu-wrapper-item" :class="{ 'active': sortsMap[currentSortField?.key] === 'asc' }"
                    @click="handleSort('asc')">
                    <div class="icon icon16 mi-warehouse arrow-up"></div>
                    Tăng dần
                    <div class="select-checked"></div>
                </li>
                <li class="menu-wrapper-item" :class="{ 'active': sortsMap[currentSortField?.key] === 'desc' }"
                    @click="handleSort('desc')">
                    <div class="icon icon16 mi-warehouse arrow-down"></div>
                    Giảm dần
                    <div class="select-checked"></div>
                </li>
                <div class="menu-border"></div>
                <li class="menu-wrapper-item" @click.stop="quickPin(currentSortField)"
                    :class="pinnedMap[currentSortField?.key] ? 'active' : ''">
                    <div class="icon icon16 mi-warehouse pin">
                    </div>
                    Ghim cột
                    <div class="select-checked"></div>
                </li>
                <li class="menu-wrapper-item" @click.stop="quickUnpin(currentSortField)">
                    <div class="icon icon16 mi-warehouse unpin"></div>
                    Bỏ ghim cột
                    <div class="select-checked"></div>
                </li>
            </ul>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { formatNumber, formatDate, formatText, formatTime } from '../../../utils/formatter';
import { onClickOutside } from '@vueuse/core';
import TableColumnFilter from './components/TableColumnFilter.vue';
import { useMessage } from '../../../composables/useMessage.ts';
import { useTableDisplaySettings } from '../../../composables/useTableDisplaySettings.ts';

const message = useMessage();

const emit = defineEmits(["row-click", "filter", "clearFilter", "sort", "quick-pin-column"]);

const props = defineProps({
    fields: {
        type: Array as any,
        required: true,
    },
    defaultFields: {
        type: Array as any,
        required: true,
    },
    rows: {
        type: Array as any,
        required: true,
    },
    disableMouseEvent: {
        type: Boolean,
        default: false,
    },
    focusedRowIndex: {
        type: Number,
        default: null,
    },
    selectedRowIndices: {
        type: Array as any,
        default: () => [],
    },
    selectedItems: {
        type: Array as any,
        default: () => [],
    },
    rowKey: {
        type: String,
        default: 'id'
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
});

const {
    handleQuickPinColumn,
    getAppliedColumns,
} = useTableDisplaySettings({ props });

const tbodyRef = ref<HTMLElement | null>(null);

const currentFilterField = ref<any | null>(null);
const currentSortField = ref<any | null>(null);
const tableRef = ref<HTMLTableElement | null>(null);
const filterModalStyle = ref<{ top?: string; left?: string; right?: string; width?: string }>({});
const filterModalWidth = 350;
const columnSortStyle = ref<{ top?: string; left?: string; right?: string; width?: string }>({});
const columnSortWidth = 140;

const sorts = ref<{ field: any; direction: string }[]>([]);
//sorts map: { [fieldKey: string]: 'asc' | 'desc' } for easy access when rendering sort icons in header
const sortsMap = computed(() => {
    const map: { [key: string]: string } = {};
    sorts.value.forEach(s => {
        map[s.field.key] = s.direction;
    });
    return map;
});

const pinnedMap = computed(() => {
    const map: { [key: string]: boolean } = {};
    props.fields.forEach((field: any) => {
        map[field.key] = field.pinned === true;
    });
    return map;
});

let lastPinnedColumnIndex = -1;
const visibleFields = computed(() => {
    let accumulatedLeft = 0;

    return props.fields
        .filter((f: any) => f.showInTable !== false)
        .map((field: any, index: number) => {
            // Xác định xem cột này có được ghim bên trái hay không
            const isPinned = field.pinned === true || field.fixed === 'left' || field.key === 'Checkbox';

            // Sao chép style gốc tránh mutate props trực tiếp
            const thStyle = { ...(field.style || {}) };
            const tdStyle = { ...(field.style || {}) };

            if (isPinned) {
                // Style cho thẻ <th> (Tiêu đề bảng)
                thStyle.position = 'sticky';
                thStyle.left = `${accumulatedLeft}px`;
                thStyle.zIndex = 55; // Cao hơn z-index: 50 của các hàng thead tr thông thường

                // Style cho thẻ <td> (Ô dữ liệu body)
                tdStyle.position = 'sticky';
                tdStyle.left = `${accumulatedLeft}px`;
                tdStyle.zIndex = 5;  // Đủ cao để đè lên các ô thường khi cuộn ngang, nhưng thấp hơn thead

                // Lấy độ rộng dạng số (ví dụ: '120px' -> 120) để cộng dồn cho cột ghim kế tiếp
                const widthStr = field.style?.width || '0px';
                const widthNum = parseInt(widthStr.replace('px', '')) || 0;
                accumulatedLeft += widthNum;
                lastPinnedColumnIndex = index;
            }

            return {
                ...field,
                thStyle,
                tdStyle
            };
        });
});


const handleColumnHeaderClick = (field: any, event: MouseEvent) => {
    if (!field.sortable) {
        return;
    }
    console.log("Column header clicked:", field);
    currentSortField.value = field;
    const target = event.currentTarget as HTMLElement;
    if (!target || !tableRef.value) return;

    const viewport = tableRef.value;
    const viewportRect = viewport.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const modalMarginTop = 8;
    const scrollTop = viewport.scrollTop;
    const scrollLeft = viewport.scrollLeft;

    const topPosition = (targetRect.bottom - viewportRect.top) + scrollTop + modalMarginTop;

    // TÍNH TOÁN MỚI: Mép trái modal = Mép trái cột
    // Lấy khoảng cách từ mép trái bảng đến mép trái cột, sau đó cộng thêm khoảng cuộn scrollLeft
    let leftPosition = (targetRect.left - viewportRect.left) + scrollLeft;

    // KIỂM TRA TRÀN PHẢI: 
    // Nếu cột nằm sát bên phải bảng, modal hiển thị từ mép trái cột có thể bị tràn ra ngoài vùng nhìn thấy của bảng
    if (leftPosition + columnSortWidth > viewportRect.width + scrollLeft) {
        // Ép mép phải của modal bằng mép phải của bảng (trừ đi khoảng cách an toàn 8px)
        leftPosition = viewportRect.width + scrollLeft - columnSortWidth - 8;
    }

    // KIỂM TRA TRÀN TRÁI (Trường hợp an toàn phụ khi bảng quá hẹp)
    if (leftPosition < scrollLeft) {
        leftPosition = scrollLeft + 8;
    }

    columnSortStyle.value = {
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
        right: 'auto',
        width: `${columnSortWidth}px`,
    };
};



const handleFilterClick = (field: any, event: MouseEvent) => {
    currentFilterField.value = field;
    console.log("Filter clicked for field:", currentFilterField.value);

    const target = event.currentTarget as HTMLElement;
    if (!target || !tableRef.value) return;

    const viewport = tableRef.value;
    const viewportRect = viewport.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const modalMarginTop = 16;
    const scrollTop = viewport.scrollTop;
    const scrollLeft = viewport.scrollLeft;

    const topPosition = (targetRect.bottom - viewportRect.top) + scrollTop + modalMarginTop;

    // TÍNH TOÁN MỚI: Mép phải modal = Mép phải icon
    // Lấy khoảng cách từ mép trái bảng đến mép phải icon, sau đó trừ đi chiều rộng của modal
    let leftPosition = (targetRect.right - viewportRect.left) + scrollLeft - filterModalWidth;

    // KIỂM TRA TRÀN TRÁI: 
    // Nếu bảng hẹp hoặc vị trí cột quá sát bên trái, modal có thể bị tràn ra ngoài (leftPosition < scrollLeft)
    if (leftPosition < scrollLeft) {
        // Neo lại cách lề trái màn hình 8px
        leftPosition = scrollLeft + 8;
    }

    // KIỂM TRA TRÀN PHẢI (Trường hợp an toàn phụ)
    if (leftPosition + filterModalWidth > viewportRect.width + scrollLeft) {
        leftPosition = viewportRect.width + scrollLeft - filterModalWidth - 16;
    }

    filterModalStyle.value = {
        top: `${topPosition}px`,
        left: `${leftPosition}px`,
        right: 'auto',
        width: `${filterModalWidth}px`,
    };
};

// filter handler
const handleCloseFilter = () => {
    currentFilterField.value = null;
};

const handleApplyFilter = (filterData: any) => {
    console.log("Áp dụng filter với dữ liệu:", filterData);
    handleCloseFilter();
    emit("filter", filterData);
};

const handleClearFilter = (filterData: any) => {
    console.log("Xóa filter với dữ liệu:", filterData);
    handleCloseFilter();
    emit("clearFilter", filterData);
};

// sort handler
const handleSort = (direction: string) => {
    if (!currentSortField.value) return;
    const existingSortIndex = sorts.value.findIndex(s => s.field.key === currentSortField.value.key);
    if (direction === '') {
        if (existingSortIndex >= 0) {
            console.log("Xóa trạng thái sort của trường:", currentSortField.value.key);
            sorts.value.splice(existingSortIndex, 1);
        }
    }
    else {
        if (existingSortIndex >= 0) {
            sorts.value[existingSortIndex].direction = direction;
        }
        else {
            sorts.value.push({ field: currentSortField.value, direction: direction });
        }
    }
    // console.log("Mảng Sorts sau khi xử lý:", sorts.value);
    const sortString = sorts.value.length > 0
        ? JSON.stringify(sorts.value.map(s => ({ Selector: s.field.key, Desc: s.direction === 'desc' ? true : false })))
        : "";
    emit("sort", sortString);
    currentSortField.value = null;
};

// Quick pin column handler
const quickPin = (field: any) => {
    console.log("Quick pin column:", field);
    handleQuickPinColumn(field, field.pinned !== true);
    const dataToApply = getAppliedColumns();
    emit("quick-pin-column", dataToApply);
    currentSortField.value = null;
};

const quickUnpin = (field: any) => {
    console.log("Quick unpin column:", field);
    handleQuickPinColumn(field, false);
    const dataToApply = getAppliedColumns();
    emit("quick-pin-column", dataToApply);
    currentSortField.value = null;
};

// Click bên ngoài tự đóng
const filterPopoverRef = ref<HTMLElement | null>(null);
const sortPopoverRef = ref<HTMLElement | null>(null);
onClickOutside(filterPopoverRef, () => {
    handleCloseFilter();
});
onClickOutside(sortPopoverRef, () => {
    currentSortField.value = null;
});

// Lắng nghe sự kiện cuộn trang để ẩn popover tránh bị trôi
const handleScrollClose = (event: Event) => {
    if (!currentFilterField.value && !currentSortField.value) {
        return;
    }
    const target = event.target as Node;
    if (filterPopoverRef.value && filterPopoverRef.value.contains(target)) {
        return;
    }

    handleCloseFilter();
    currentSortField.value = null;
};

onMounted(() => {
    window.addEventListener('scroll', handleScrollClose, true);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScrollClose, true);
});


const handleFormat = (value: any, type: string) => {
    switch (type) {
        case "number":
            return formatNumber(value);
        case "date":
            return formatDate(value);
        case "time":
            return formatTime(value);
        case "text":
            return formatText(value);
        default:
            return formatText(value);
    }
};

const showInDevelopmentMessage = () => {
    message.show({
        icon: "mi-qtsx icon-info bg-(--color-info)!",
        title: "Tính năng đang phát triển",
        variant: "info",
        message: "Tính năng này đang được phát triển.",
        acceptText: "Đóng",
    });
};

defineExpose({
    tbodyRef
});



</script>

<style lang="scss" scoped>
table {
    width: 100%;
    table-layout: fixed;

    thead {
        tr {
            z-index: 50;
            position: sticky;
            top: 0;
            background: #F3F4F6;
            box-shadow: 0 1px 0 #D1D5DB;
        }
    }

    .ms-tr {
        position: relative;
        z-index: 0;

        &.row-selected,
        &.row-selected td {
            background-color: #a4f6d3 !important;
        }

        &:hover {
            z-index: 1;

            .display-on-hover {
                opacity: 1 !important;
            }

            .ms-col-td {
                background-color: #F9FAFB;
            }
        }

        .ms-col-td {
            background-color: #FFF;
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
        }




    }

    .ms-col-th {
        height: 33px !important;
        font-weight: 400;
        background: #F3F4F6;
        cursor: pointer;
        font-weight: 600;
        /* min-width: 200px; */
        /* width: 200px; */
        position: relative;


        &:hover {
            .title-wrapper .filter {
                display: block;
            }
        }

        &:has(.resizer:hover) {
            .title-wrapper .filter {
                display: none !important;
            }
        }

        .title-wrapper {
            display: flex;
            align-items: center;
            column-gap: 4px;
            padding: 0 16px;
            border-right: 2px solid #D1D5DB;

            .title {
                display: flex;
                align-items: center;
                text-align: left;
                width: 100%;
                gap: 4px;

                .pin {
                    display: none;
                }

                .pinned {
                    display: block !important;
                }

                .sort {
                    display: block;

                    &.unsorted {
                        display: none !important;
                    }
                }


            }

            .filter {
                display: none;

                &.filtered {
                    display: block !important;
                }
            }


        }

        .resizer {
            width: 5px;
            height: 100%;
            cursor: col-resize;
            user-select: none;
            position: absolute;
            right: 0;
            top: 0;

            &:hover {
                border-right: 2px solid #ddd;
            }

        }

    }

    .ms-col-td {
        // padding: 0 16px;
        height: 32px;
        vertical-align: middle;
        border-bottom: 1px solid #E5E7EB;
        font-size: 13px;
        position: relative;
        overflow: visible;

        .display-on-hover {
            opacity: 0 !important;
        }
    }
}

// Tìm và sửa lại selector .filter-modal trong CSS của bạn:
.filter-modal {
    display: block;
    position: absolute;
    /* Nó sẽ absolute dựa trên div wrapper có ref="tableRef" */
    z-index: 110;
    /* Đảm bảo cao hơn z-index: 50 của thead tr */
    width: 240px;
    /* Set cứng width hoặc min-width trùng với số tính toán ở JS */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: #fff;
    border-radius: 4px;
    animation: slide-in 0.3s ease;
}

.sort-modal {
    padding: 8px 0px;
    height: auto;
    list-style: none;
    display: block;
    position: absolute;
    z-index: 110;
    background-color: #fff;
    box-shadow: 0 0 8px #0000001a, 0 8px 16px #0000001a;
    border-radius: 8px;
    margin: 0;
    overflow: hidden;
    animation: slide-in 0.2s ease;

    .menu-wrapper-item {
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 8px;
        outline: none;
        padding: 8px 12px;
        color: inherit;
        text-decoration: none;
        height: 32px;
        cursor: pointer;
        transition: all .7s ease;

        &:hover {
            outline: 0;
            background-color: #f3f4f6;
            border-radius: 2px;
            transition: all .2s ease;
        }

        &.active {
            background-color: var(--primary-soft-light);
            color: var(--primary-color);

            .icon {
                background-color: var(--primary-color) !important;
            }

            .select-checked {
                display: block;
            }
        }
    }

    .menu-border {
        position: relative;
        display: flex;
        margin: 8px 12px;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
        height: 0.5px;
        background: #d1d5db;
    }

    .select-checked {
        width: 10px;
        height: 5.67px;
        border-width: 0 0 1px 1px;
        border-style: solid;
        border-color: #0e9a62;
        transform: translateY(-2px) rotate(-45deg);
        display: none;
        margin-left: auto;
    }
}

.grid-no-data {
    position: absolute;
    text-align: center;
    font-style: normal;
    color: #111827;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
}

.loading-icon {
    position: absolute;
    text-align: center;
    font-style: normal;
    color: #111827;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
}

//Animate slide in cho filter-modal
@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
