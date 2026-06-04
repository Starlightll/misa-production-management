<template lang="html">
    <table class="ms-table">
        <thead class="ms-thead bg-(--bg-semi-dark)">
            <tr>
                <th v-for="(field, index) in fields" :key="field.key" :style="field.style || {}" scope="col"
                    class="ms-col-th">
                    <div class="title-wrapper" :style="[
                        index === fields.length - 1 ? 'border-right: none !important;' : '',
                    ]">
                        <!-- Title -->
                        <div class="title">
                            <!-- Pin icon -->
                            <div class="icon pin mi-pin icon16 bg-gray-600!"></div>
                            <!-- Text -->
                            <div class="flex-1 flex items-center" :class="[
                                field.type === 'number' ? 'text-end! justify-end!' : field.type === 'date' ? 'text-center! justify-center!' : field.type === 'time' ? 'text-start! justify-start!' : field.type === 'text' ? 'text-left! justify-start!' : 'text-start! justify-start!',
                            ]">
                                <template v-if="field.type === 'custom'">
                                    <slot :name="`title-${field.key}`" :field="field">
                                        {{ field.label }}
                                    </slot>
                                </template>
                                <template v-else>
                                    {{ field.label }}
                                </template>
                            </div>
                            <!-- Sort icon -->
                            <div class="icon sort mi-arrow-up icon16 bg-gray-600!"></div>
                        </div>
                        <!-- Filter icon -->
                        <div v-if="field.filterable" class="icon mi-warehouse icon16 bg-gray-600! "
                            :class="field.filterData.value ? 'filtered filter--active' : 'filter'"
                            @click.stop="handleFilterClick(field, $event)">
                        </div>
                    </div>

                    <!-- Resizer -->
                    <div v-if="field.resizable" class="resizer"></div>
                </th>
            </tr>
        </thead>
        <tbody class="ms-tbody bg-white divide-y divide-gray-200">
            <tr v-for="(row, index) in rows" :key="index" class="ms-tr"
                :class="[index == props.focusedRowIndex ? 'z-10!' : '', props.selectedRowIndices.includes(index) ? 'row-selected' : '']">
                <td v-for="field in fields" :key="field.key" :style="field.style || {}" class="ms-col-td">
                    <div class="flex flex-1" :class="[
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
                            <slot :name="field.key" :row="row" :rowIndex="index" :field="field" :value="row[field.key]">
                                {{ handleFormat(row[field.key], "text") }}
                            </slot>
                        </template>

                        <!-- Other types -->
                        <template v-else>
                            {{ handleFormat(row[field.key], field.type || "text") }}
                        </template>
                    </div>

                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { formatNumber, formatDate, formatText, formatTime } from '../../../utils/formatter';

const emit = defineEmits(["filter"]);

const handleFilterClick = (field: any, event: MouseEvent) => {
    emit("filter", { field, event });
};

const props = defineProps({
    fields: {
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

                .sort {
                    display: none;
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
        padding: 0 16px;
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
</style>
