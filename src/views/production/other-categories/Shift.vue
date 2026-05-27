<script setup lang="ts">
import { ref } from 'vue';
import MsButton from '../../../components/base/ms-button/MsButton.vue';
import MsInput from '../../../components/base/ms-input/MsInput.vue';
import MsSelect from '../../../components/base/ms-select/MsSelect.vue';
import MsTableDefault from '../../../components/base/ms-table/MsTableDefault.vue';
import MsModal from '../../../components/base/ms-modal/MsModal.vue';

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
</script>

<template lang="html">
    <div class="layout">
        <!-- Title -->
        <div class="title-box flex-row flex">
            <div class=" title-box__title">Ca làm việc</div>
            <MsButton class="" severity="primary">
                <div class="icon left plus mi-warehouse icon16 bg-white!"></div>
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
                    <div class="table-container__toolbar__left">
                        <MsInput class="w-[240px]" placeholder="Tìm kiếm..."
                            icon="mi-warehouse icon16 icon left search" />
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
                        <MsTableDefault />
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
        </div>
        <!-- Modals -->
        <!-- Add/Edit shift Modal -->
        <MsModal :title="'ABC'" :visible="false" width="600px" height="auto"></MsModal>
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

        .table-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            /* border-radius: 8px; */
            /* overflow: hidden; */

            &__toolbar {
                padding: 12px 16px;
                background: #fff;
                border-radius: 8px 8px 0 0;
            }

            &__table {
                flex: 1;
                display: flex;
                flex-direction: column;

                &__content {
                    flex: 1;
                    overflow: auto;
                    background: #fff;
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

.disabled {
    cursor: not-allowed;
    opacity: 0.3;
}
</style>