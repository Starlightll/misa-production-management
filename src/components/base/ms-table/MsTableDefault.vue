<template lang="html">
    <table class="ms-table">
        <thead class="ms-thead bg-(--bg-semi-dark)">
            <tr class="ms-tr">
                <th scope="col" class="ms-col-th">
                    <div class="title-wrapper">
                        <!-- Title -->
                        <div class="title">
                            <!-- Pin icon -->
                            <div class="icon pin mi-pin icon16 bg-gray-600!"></div>
                            <!-- Text -->
                            <div>Mã ca</div>
                            <!-- Sort icon -->
                            <div class="icon sort mi-arrow-up icon16 bg-gray-600!"></div>
                        </div>
                        <!-- Filter icon -->
                        <div class="icon filter mi-warehouse icon16 bg-gray-600!"></div>
                    </div>
                    <!-- Resizer -->
                    <div class="resizer"></div>
                </th>
                <th scope="col" class="ms-col-th">
                    <div class="title-wrapper">
                        <!-- Title -->
                        <div class="title">
                            <!-- Pin icon -->
                            <div class="icon pin mi-pin icon16 bg-gray-600!"></div>
                            <!-- Text -->
                            <div>Mã ca</div>
                            <!-- Sort icon -->
                            <div class="icon sort mi-arrow-up icon16 bg-gray-600!"></div>
                        </div>
                        <!-- Filter icon -->
                        <div class="icon filter mi-warehouse icon16 bg-gray-600!"></div>
                    </div>
                    <!-- Resizer -->
                    <div class="resizer"></div>
                </th>
                <th scope="col" class="ms-col-th">
                    <div class="title-wrapper">
                        <!-- Title -->
                        <div class="title">
                            <!-- Pin icon -->
                            <div class="icon pin mi-pin icon16 bg-gray-600!"></div>
                            <!-- Text -->
                            <div>Mã ca</div>
                            <!-- Sort icon -->
                            <div class="icon sort mi-arrow-up icon16 bg-gray-600!"></div>
                        </div>
                        <!-- Filter icon -->
                        <div class="icon filter mi-warehouse icon16 bg-gray-600!"></div>
                    </div>
                    <!-- Resizer -->
                    <div class="resizer"></div>
                </th>
                <th scope="col" class="ms-col-th">
                    <div class="title-wrapper">
                        <!-- Title -->
                        <div class="title">
                            <!-- Pin icon -->
                            <div class="icon pin mi-pin icon16 bg-gray-600!"></div>
                            <!-- Text -->
                            <div>Mã ca</div>
                            <!-- Sort icon -->
                            <div class="icon sort mi-arrow-up icon16 bg-gray-600!"></div>
                        </div>
                        <!-- Filter icon -->
                        <div class="icon filter mi-warehouse icon16 bg-gray-600!"></div>
                    </div>
                    <!-- Resizer -->
                    <div class="resizer"></div>
                </th>
                <th scope="col" class="ms-col-th">
                    <div class="title-wrapper">
                        <!-- Title -->
                        <div class="title">
                            <!-- Pin icon -->
                            <div class="icon pin mi-pin icon16 bg-gray-600!"></div>
                            <!-- Text -->
                            <div>Mã ca</div>
                            <!-- Sort icon -->
                            <div class="icon sort mi-arrow-up icon16 bg-gray-600!"></div>
                        </div>
                        <!-- Filter icon -->
                        <div class="icon filter mi-warehouse icon16 bg-gray-600!"></div>
                    </div>
                    <!-- Resizer -->
                    <div class="resizer"></div>
                </th>

            </tr>
        </thead>
        <tbody class="ms-tbody bg-white divide-y divide-gray-200">
            <tr v-for="i in 5" :key="i" class="ms-tr">
                <td class="ms-col-td" v-tooltip.bottom="'CL0001'">
                    <div class=" text-gray-900">CL0001</div>
                </td>
                <td class="ms-col-td" v-tooltip.bottom="'Ca 1'">
                    <div class=" text-gray-900">Ca 1</div>
                </td>
                <td class="ms-col-td" v-tooltip.bottom="'07:00'">
                    <div class=" text-gray-900">07:00</div>
                </td>
                <td class="ms-col-td" v-tooltip.bottom="'15:00'">
                    <div class="  text-gray-900">15:00</div>
                </td>
                <td class="ms-col-td">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                </td>
            </tr>

        </tbody>
    </table>
</template>
<script setup lang="ts">
</script>

<style lang="css" scoped>
table {
    min-width: 100%;

    .ms-col-th {
        height: 33px !important;
        position: sticky;
        top: 0;
        font-weight: 400;
        background: #F3F4F6;
        border-bottom: 1px solid #D1D5DB;
        z-index: 2;
        cursor: pointer;
        /* min-width: 200px; */
        width: 200px;

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
        background-color: #fff;
        border-bottom: 1px solid #E5E7EB;
        font-size: 13px;
    }
}
</style>
