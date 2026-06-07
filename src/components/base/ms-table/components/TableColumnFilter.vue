<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import MsInput from '../../ms-input/MsInput.vue';

// const textFilterData = ref({
//     operator: 'contains',
//     value: '',
// });
// const numberFilterData = ref({
//     operator: '=',
//     value: '',
// });
// const dateFilterData = ref({
//     operator: '=',
//     value: '',
// });
// const selectFilterData = ref({
//     operator: '=',
//     value: '',
// });


// const filterMessage = ref('');

// const addFilterToColumnFilters = (fieldKey: string, type: string, fieldLabel: string, operator: string, operatorLabel: string, value: any) => {
//     const existingFilterIndex = columnFilters.value.findIndex((f) => f.key === fieldKey);
//     if (existingFilterIndex !== -1) {
//         columnFilters.value[existingFilterIndex].operator = operator;
//         columnFilters.value[existingFilterIndex].value = value;
//         columnFilters.value[existingFilterIndex].type = type;
//         columnFilters.value[existingFilterIndex].fieldLabel = fieldLabel;
//         columnFilters.value[existingFilterIndex].operatorLabel = operatorLabel;
//     } else {
//         columnFilters.value.push({ key: fieldKey, type: type, fieldLabel: fieldLabel, operatorLabel: operatorLabel, operator, value });
//     }
// };

const textDefaultOperator = 'contains';
const numberDefaultOperator = '=';
const dateDefaultOperator = '=';


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
const currentFilterField = ref<any>(null);

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
        const option = props.field.filter?.filterOptions.find((o: any) => o.value === operatorValue);
        // console.log('Get operator label for select filter:', option?.label);
        return option ? option.label : operatorValue;
    }
    return operatorValue;
};



// const applyFilter = async () => {
//     if (!currentFilterField.value) return;
//     // Lấy field đang filter hiện tại
//     const field = fields.find((f) => f.key === currentFilterField.value.key);
//     if (!field) return;
//     //Cách 1: Kiểm tra nếu value rỗng thì không thêm filter 
//     if (field.filterType === 'text') {
//         //Kiểm tra nếu textFilterData operator là isnull hoặc isnotnull thì không cần value vẫn áp dụng filter được, ngược lại nếu operator khác mà value rỗng thì sẽ không áp dụng filter và yêu cầu người dùng nhập value
//         if ((textFilterData.value.operator === 'isnull' || textFilterData.value.operator === 'isnotnull') || textFilterData.value.value) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = textFilterData.value.operator;
//             field.filterData.value = textFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, textFilterData.value.operator, getOperatorLabel(field.filterType, textFilterData.value.operator), textFilterData.value.value);
//         } else if (textFilterData.value.value) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = textFilterData.value.operator;
//             field.filterData.value = textFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, textFilterData.value.operator, getOperatorLabel(field.filterType, textFilterData.value.operator), textFilterData.value.value);
//         } else {
//             textFilterInput.value?.$el.querySelector('input')?.focus();
//             filterMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
//             return;
//         }
//     } else if (field.filterType === 'number') {
//         //Kiểm tra nếu numberFilterData operator là isnull hoặc isnotnull thì không cần value vẫn áp dụng filter được, ngược lại nếu operator khác mà value rỗng thì sẽ không áp dụng filter và yêu cầu người dùng nhập value
//         if ((numberFilterData.value.operator === 'isnull' || numberFilterData.value.operator === 'isnotnull') || numberFilterData.value.value) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = numberFilterData.value.operator;
//             field.filterData.value = numberFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, numberFilterData.value.operator, getOperatorLabel(field.filterType, numberFilterData.value.operator), numberFilterData.value.value);
//         } else if (numberFilterData.value.value) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = numberFilterData.value.operator;
//             field.filterData.value = numberFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, numberFilterData.value.operator, getOperatorLabel(field.filterType, numberFilterData.value.operator), numberFilterData.value.value);
//         } else {
//             numberFilterInput.value?.$el.querySelector('input')?.focus();
//             filterMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
//             return;
//         }
//     } else if (field.filterType === 'date') {
//         //Kiểm tra nếu dateFilterData operator là isnull hoặc isnotnull thì không cần value vẫn áp dụng filter được, ngược lại nếu operator khác mà value rỗng thì sẽ không áp dụng filter và yêu cầu người dùng nhập value
//         if ((dateFilterData.value.operator === 'isnull' || dateFilterData.value.operator === 'isnotnull') || dateFilterData.value.value) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = dateFilterData.value.operator;
//             field.filterData.value = dateFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, dateFilterData.value.operator, getOperatorLabel(field.filterType, dateFilterData.value.operator), dateFilterData.value.value);
//         } else if (dateFilterData.value.value) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = dateFilterData.value.operator;
//             field.filterData.value = dateFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, dateFilterData.value.operator, getOperatorLabel(field.filterType, dateFilterData.value.operator), dateFilterData.value.value);
//         } else {
//             dateFilterInput.value?.$el.querySelector('input')?.focus();
//             filterMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
//             return;
//         }
//     } else if (field.filterType === 'select') {
//         console.log('Select filter value:', selectFilterData.value.value);
//         if (selectFilterData.value.value !== '' && selectFilterData.value.value !== null && selectFilterData.value.value !== undefined) {
//             // Thêm filter cho cột này với operator và value đã chọn
//             field.filterData.operator = selectFilterData.value.operator;
//             field.filterData.value = selectFilterData.value.value;
//             // Cập nhật columnFilters để lưu filter đã áp dụng
//             addFilterToColumnFilters(field.key, field.filterType, field.label, selectFilterData.value.operator, getOperatorLabel(field.filterType, selectFilterData.value.value), selectFilterData.value.value);
//         } else {
//             selectFilterInput.value?.$el.querySelector('input')?.focus();
//             filterMessage.value = 'Vui lòng chọn giá trị để áp dụng filter.';
//             return;
//         }
//     }

//     //Cách 2: Không kiểm tra xem value có rỗng hay không
//     if (field.filterType === 'text') {

//     } else if (field.filterType === 'number') {

//     } else if (field.filterType === 'date') {

//     } else if (field.filterType === 'select') {

//     }

//     await fetchDataPaging(pagingParams.value);
//     closeFilterModal();

// };

// const clearFilter = () => {
//     if (!currentFilterField.value) return;
//     // Lấy field đang filter hiện tại
//     const field = fields.find((f) => f.key === currentFilterField.value.key);
//     if (!field) return;

//     // Xóa filter cho cột này
//     field.filterData!.operator = '';
//     field.filterData!.value = '';

//     // Xóa filter khỏi columnFilters
//     removeFilterFromColumnFilters(field.key);
//     clearFilterData();
// };

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

const props = defineProps<{
    field: any;
}>();

const emit = defineEmits(['apply', 'clear', 'close']);

// Bản sao local để người dùng nhập liệu, tránh ghi đè trực tiếp lên field của cha khi chưa bấm Áp dụng
const filterData = ref({
    key: props.field.key,
    type: props.field.filter?.filterType,
    operatorLabel: '',
    operator: '',
    value: ''
});

const validateMessage = ref('');

const handleApply = () => {
    //validate before apply
    if ((props.field.filter?.filterType === 'text') && !filterData.value.value) {
        validateMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
        return textFilterInput.value?.$el.querySelector('input')?.focus();
    }
    if ((props.field.filter?.filterType === 'number') && !filterData.value.value) {
        validateMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
        return numberFilterInput.value?.$el.querySelector('input')?.focus();
    }
    if ((props.field.filter?.filterType === 'date') && !filterData.value.value) {
        validateMessage.value = 'Vui lòng nhập giá trị để áp dụng filter.';
        return dateFilterInput.value?.$el.querySelector('input')?.focus();
    }
    if ((props.field.filter?.filterType === 'select') && (filterData.value.value === '' || filterData.value.value === null || filterData.value.value === undefined)) {
        validateMessage.value = 'Vui lòng chọn giá trị để áp dụng filter.';
        return selectFilterInput.value?.$el.querySelector('input')?.click();
    }

    filterData.value.operatorLabel = getOperatorLabel(props.field.filter?.filterType, (filterData.value.type === 'select' ? filterData.value.value : filterData.value.operator));
    // console.log('Apply filter with data:', filterData.value);
    emit('apply', filterData.value);
};

const handleClear = () => {
    filterData.value.value = '';
    filterData.value.operatorLabel = '';
    emit('clear', filterData.value);
};

const handleClose = () => {
    emit('close');
};

onMounted(() => {
    // Nếu cột này đã có dữ liệu lọc từ trước, nạp lại lên UI local để người dùng sửa
    if (props.field.filter?.filterData?.operator || props.field.filter?.filterData?.value) {
        filterData.value.operator = props.field.filter?.filterData?.operator;
        filterData.value.value = props.field.filter?.filterData?.value;
    } else {
        // Thiết lập operator mặc định ban đầu cho từng loại dữ liệu
        filterData.value.operator = props.field.filter?.filterType === 'text' ? 'contains' : '=';
    }
});

const setFilterOperator = (operator: string, label: string) => {
    filterData.value.operator = operator;
    filterData.value.operatorLabel = label;

    // if (['isnull', 'isnotnull'].includes(operator)) {
    //     filterData.value.value = '';
    // }
};

const setFilterData = (value: any) => {
    filterData.value.value = value;
};

</script>
<template lang="html">
    <!-- Filter Modal -->
    <div ref="filterModalRef" class="condition-container gap-4">
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <div class="column-filter-text mr-2">Lọc {{ props.field.label.toLowerCase() }}</div>
                <MsButton serverity="secondary" variant="text" @click="handleClose">
                    <div class="icon icon16 close mi-warehouse"></div>
                </MsButton>
            </div>
            <!-- Filter Options -->
            <div class="flex flex-col gap-2">
                <!-- Text Filter -->
                <div v-if="props.field.filter?.filterType === 'text'">
                    <MsSelect placeholder="Chọn điều kiện" :options="textFilterOptions" class="w-full"
                        valueField="value" labelField="label" v-model="filterData.operator">
                    </MsSelect>
                    <MsInput ref="textFilterInput" placeholder="Nhập giá trị lọc" class="w-full mt-2"
                        :readonly="['isnull', 'isnotnull'].includes(filterData.operator)"
                        :modelValue="['isnull', 'isnotnull'].includes(filterData.operator) ? '' : filterData.value"
                        @update:modelValue="setFilterData($event)" :error="validateMessage"
                        v-tooltip.bottom="validateMessage" />
                </div>
                <!-- Number Filter -->
                <div v-if="props.field.filter?.filterType === 'number'">
                    <MsSelect placeholder="Chọn điều kiện" :options="numberFilterOptions" class="w-full"
                        valueField="value" labelField="label" v-model="filterData.operator">
                    </MsSelect>
                    <MsInput ref="numberFilterInput" type="number" placeholder="Nhập giá trị lọc" class="w-full mt-2"
                        :readonly="['isnull', 'isnotnull'].includes(filterData.operator)"
                        :modelValue="['isnull', 'isnotnull'].includes(filterData.operator) ? '' : filterData.value"
                        @update:modelValue="setFilterData($event)" :error="validateMessage"
                        v-tooltip.bottom="validateMessage" />
                </div>
                <!-- Date Filter -->
                <div v-if="props.field.filter?.filterType === 'date'">
                    <MsSelect placeholder="Chọn điều kiện" :options="dateFilterOptions" class="w-full"
                        valueField="value" labelField="label" v-model="filterData.operator">
                    </MsSelect>
                    <MsDatepicker ref="dateFilterInput" placeholder="Chọn ngày" class="w-full mt-2" :type="'date'"
                        :readonly="['isnull', 'isnotnull'].includes(filterData.operator)"
                        :modelValue="['isnull', 'isnotnull'].includes(filterData.operator) ? '' : filterData.value"
                        @update:modelValue="setFilterData($event)" :error="validateMessage"
                        v-tooltip.bottom="validateMessage" />
                </div>
                <!-- Select Filter -->
                <div v-if="props.field.filter?.filterType === 'select'">
                    <MsSelect ref="selectFilterInput" placeholder="Chọn giá trị lọc"
                        :options="props.field.filter?.filterOptions" class="w-full" valueField="value"
                        labelField="label" v-model="filterData.value"
                        @update:modelValue="setFilterData($event); setFilterOperator('=', $event.label)"
                        :error="validateMessage" v-tooltip.bottom="validateMessage">
                    </MsSelect>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <div>
                    <MsButton serverity="secondary" class="bg-gray-100! hover:bg-gray-200!" @click="handleClear">
                        <div class=" text-(--text)">Bỏ lọc</div>
                    </MsButton>
                </div>
                <div class="flex items-center gap-x-2">
                    <MsButton serverity="secondary" variant="outlined" @click="handleClose">
                        <div class=" text-(--text)">Hủy</div>
                    </MsButton>
                    <MsButton @click="handleApply">
                        <div class="">Áp dụng</div>
                    </MsButton>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
// Filter modal
.condition-container {
    padding: 16px;
    // position: absolute;
    border: none;
    // z-index: 1002;
    background: white;
    width: -moz-fit-content;
    width: 100%;
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
</style>