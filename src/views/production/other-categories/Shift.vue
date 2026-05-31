<script setup lang="ts">
import { ref } from 'vue';
import MsButton from '../../../components/base/ms-button/MsButton.vue';
import MsModal from '../../../components/base/ms-modal/MsModal.vue';
import ShiftDataTable from '../../../components/modules/production/ShiftDataTable.vue';
import MsDatepicker from '../../../components/base/ms-datepicker/MsDatepicker.vue';
import MsInput from '../../../components/base/ms-input/MsInput.vue';
import MsTextArea from '../../../components/base/ms-textarea/MsTextArea.vue';
const dateValue = ref('');

const isAddEditShiftModalVisible = ref(false);
const showAddEditShiftModal = () => {
    isAddEditShiftModalVisible.value = true;
};

const closeAddEditShiftModal = () => {
    isAddEditShiftModalVisible.value = false;
};

</script>

<template lang="html">
    <div class="layout">
        <!-- Title -->
        <div class="title-box flex-row flex">
            <div class=" title-box__title">Ca làm việc</div>
            <MsButton class="" severity="primary" @click="showAddEditShiftModal">
                <div class="icon left plus mi-warehouse icon16 bg-white!"></div>
                <div class="pl-[4px]">Thêm</div>
            </MsButton>
        </div>
        <!-- Body -->
        <div class="layout-body">
            <ShiftDataTable />
        </div>
        <!-- Modals -->
        <!-- Add/Edit shift Modal -->
        <MsModal :title="'ABC'" :visible="isAddEditShiftModalVisible" width="680px" height="auto">
            <template #header>
                <div class="form__popup__header__title">
                    <div class="form__popup__header__title__text">Thêm ca làm việc</div>
                </div>
                <div class="flex gap-2">
                    <div class="mi-warehouse icon20 ic-help cursor-pointer" @click="" v-tooltip.top="'Trợ giúp'">
                    </div>
                    <div class="mi-warehouse icon20 close cursor-pointer" @click="closeAddEditShiftModal"
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
                        <MsInput placeholder="Nhập mã ca làm việc" />
                    </div>
                </div>
                <div class="w-full flex gap-4 items-center mb-[16px]">
                    <label class="w-[150px]">
                        Tên ca <span class="text-red-500">*</span>
                    </label>
                    <div class="flex-1">
                        <MsInput placeholder="Nhập tên ca làm việc" />
                    </div>
                </div>

                <div class="w-full flex gap-4 items-center mb-[16px]">
                    <div class="w-1/2 flex gap-4 items-center mr-3">
                        <label class="w-[150px]">
                            Giờ vào ca
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="flex-1">
                            <MsDatepicker placeholder="HH:MM" v-model="dateValue" icon="mi-warehouse clock icon16"
                                :type="'time'" />
                        </div>
                    </div>
                    <div class="w-1/2 flex gap-4 items-center">
                        <label class="w-[150px]">
                            Giờ hết ca
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="flex-1">
                            <MsDatepicker placeholder="HH:MM" v-model="dateValue" icon="mi-warehouse clock icon16"
                                :type="'time'" />
                        </div>
                    </div>
                </div>
                <div class="w-full flex gap-4 items-center mb-[16px]">
                    <div class="w-1/2 flex gap-4 items-center mr-3">
                        <label class="w-[150px]">
                            Bắt đầu nghỉ giữa ca
                        </label>
                        <div class="flex-1">
                            <MsDatepicker placeholder="HH:MM" v-model="dateValue" icon="mi-warehouse clock icon16"
                                :type="'time'" />
                        </div>
                    </div>
                    <div class="w-1/2 flex gap-4 items-center">
                        <label class="w-[150px]">
                            Kết thúc nghỉ giữa ca
                        </label>
                        <div class="flex-1">
                            <MsDatepicker placeholder="HH:MM" v-model="dateValue" icon="mi-warehouse clock icon16"
                                :type="'time'" />
                        </div>
                    </div>
                </div>
                <div class="w-full flex gap-4 items-center mb-[16px]">
                    <div class="w-1/2 flex gap-4 items-center mr-3">
                        <label class="w-[150px]">
                            Bắt đầu nghỉ giữa ca
                        </label>
                        <div class="flex-1">
                            <MsInput :readonly="true" :disabled="true" />
                        </div>
                    </div>
                    <div class="w-1/2 flex gap-4 items-center">
                        <label class="w-[150px]">
                            Kết thúc nghỉ giữa ca
                        </label>
                        <div class="flex-1">
                            <MsInput :readonly="true" :disabled="true" />
                        </div>
                    </div>
                </div>

                <div class="w-full flex gap-4 items-start">
                    <label class="w-[150px]">
                        Mô tả
                    </label>
                    <div class="flex-1">
                        <MsTextArea placeholder="Nhập mã ca làm việc" />
                    </div>
                </div>



            </template>
            <template #footer>
                <MsButton class="cancel" @click="closeAddEditShiftModal" :label="'Hủy'" variant="outlined"
                    severity="secondary">
                    Hủy
                </MsButton>
                <MsButton class="cancel" @click="" :label="'Hủy'" variant="outlined" severity="secondary">
                    Lưu và thêm
                </MsButton>
                <MsButton class="submit" @click="" :label="'Xác nhận'" severity="primary">
                    Lưu
                </MsButton>
            </template>
        </MsModal>
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
</style>