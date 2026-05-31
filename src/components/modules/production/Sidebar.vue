<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps<{
    isCollapsed: boolean;
}>();

//Emits
const emit = defineEmits(['toggleCollapse']);
const toggleCollapse = () => {
    emit('toggleCollapse');
    isSidebarExpanded.value = false; // Đảm bảo khi thu gọn bằng nút, menu mở rộng sẽ đóng lại

};

const route = useRoute();


const GROUP_PLAN_INDEX = 0;
const GROUP_EXECUTION_INDEX = 1;
const GROUP_PRODUCT_QUALITY_INDEX = 2;
const GROUP_PRODUCTION_MATERIAL_INDEX = 3;
const GROUP_DICTIONARY_INDEX = 4;
const GROUP_PRODUCTION_PROCESS_INDEX = 5;
const GROUP_PRODUCTION_CAPACITY_INDEX = 6;

const PLAN_SUBMENU_HEIGHT = 6 * 36;
const EXECUTION_SUBMENU_HEIGHT = 8 * 36;
const PRODUCT_QUALITY_SUBMENU_HEIGHT = 3 * 36;
const PRODUCTION_MATERIAL_SUBMENU_HEIGHT = 5 * 36;
const DICTIONARY_SUBMENU_HEIGHT = 5 * 36;
const PRODUCTION_PROCESS_SUBMENU_HEIGHT = 2 * 36;
const PRODUCTION_CAPACITY_SUBMENU_HEIGHT = 4 * 36;

const MenuItems = {
    productionPlan: {
        name: 'Kế hoạch sản xuất',
        icon: 'icon-plan',
        urls: ['/production/production-plan'],
        subMenu: [
            { name: 'Kế hoạch theo đơn hàng', url: '/production/production-plan/sale-order-plan' },
            { name: 'Kế hoạch tổng thể', url: '/production/production-plan/overall-plan' },
            { name: 'Kế hoạch chi tiết', url: '/production/production-plan/detail-plan' },
            { name: 'Kế hoạch nguyên vật liệu', url: '/production/production-plan/material-plan' },
            { name: 'Yêu cầu mua NVL', url: '/production/production-plan/material-purchase-request' },
            { name: 'Đơn mua hàng', url: '/production/production-plan/purchase-order' },
        ],
    },
    productionExecution: {
        name: 'Điều phối và thực thi',
        icon: 'icon-power',
        urls: ['/production/production-execution'],
        subMenu: [
            { name: 'Lệnh sản xuất', url: '/production/production-execution/order' },
            { name: 'Lệnh tháo gỡ', url: '/production/production-execution/dismantle-order' },
            { name: 'Lịch sản xuất', url: '/production/production-execution/schedule' },
            { name: 'Yêu cầu xuất vật tư', url: '/production/production-execution/material-request' },
            { name: 'Thống kê sản xuất', url: '/production/production-execution/statistics' },
            { name: 'Yêu cầu nhập thành phầm, nguyên vật liệu thừa', url: '/production/production-execution/product-request' },
            {
                name: 'Bàn giao sản phẩm', url: '/production/production-execution/handover-product',
                panel: {
                    columns: [
                        {
                            title: '',
                            items: [{ name: 'Bàn giao', url: '/production/production-execution/handover-product' }, { name: 'Trả lại', url: '/production/production-execution/handover-material' },]
                        }
                    ]
                }
            },
            { name: 'Trả lại NVL thừa', url: '/production/production-execution/handover-material' },
            { name: 'Tình hình bàn giao sản xuất', url: '/production/production-execution/handover-overview' },
        ],
    },
    productQuality: {
        name: 'Kiểm tra chất lượng',
        icon: 'icon-quality-control',
        urls: ['/production/product-quality'],
        subMenu: [
            { name: 'Yêu cầu kiểm tra', url: '/production/product-quality/quality-check-request' },
            { name: 'Phiếu kiểm tra', url: '/production/product-quality/inspection-voucher' },
            {
                name: 'Tiêu chuẩn', url: '/production/product-quality/criteria',
                panel: {
                    columns: [
                        {
                            title: '',
                            items: [
                                { name: 'Tiêu chí chất lượng', url: '/production/product-quality/criteria' },
                                { name: 'Nhóm tiêu chí chất lượng', url: '/production/product-quality/criteria-group' },
                                { name: 'Phương pháp chọn mẫu', url: '/production/product-quality/sampling-method' },
                                { name: 'Bộ tiêu chuẩn kiểm tra chất lượng', url: '/production/product-quality/quality-standard' },
                                { name: 'Lỗi kiểm tra chất lượng', url: '/production/product-quality/quality-error' },
                                { name: 'Nhóm lỗi kiểm tra chất lượng', url: '/production/product-quality/quality-error-group' },
                            ]
                        }
                    ]
                }
            },
        ],
    },
    productionMaterial: {
        name: 'Kho vật tư',
        icon: 'icon-material-factory',
        urls: ['/production/production-material'],
        subMenu: [
            { name: 'Đề nghị kho cấp vật tư', url: '/production/production-material/request-material' },
            { name: 'Nhập kho', url: '/production/production-material/factory-inward' },
            { name: 'Xuất kho', url: '/production/production-material/export-material' },
            { name: 'Điều chuyển', url: '/production/production-material/transfer-material' },
            { name: 'Tồn kho đầu kỳ', url: '/production/production-material/opn-inventory-stock' },
        ],
    },
    dictionary: {
        name: 'Sản phẩm, NVL',
        icon: 'icon-product-material',
        urls: ['/production/dictionary'],
        subMenu: [
            { name: 'Vật tư hàng hóa', url: '/production/dictionary/inventoryitem' },
            { name: 'Nhóm vật tư hàng hóa', url: '/production/dictionary/inventoryitemgroup' },
            { name: 'Định mức nguyên vật liệu', url: '/production/dictionary/billOfMaterials' },
            { name: 'Định mức tháo dỡ', url: '/production/dictionary/billOfDisassembly' },
            { name: 'Nguyên vật liệu thay thế', url: '/production/dictionary/alternativeMaterialList' },
        ],
    },
    productionProcess: {
        name: 'Quy trình',
        icon: 'icon-process',
        urls: ['/production/production-process'],
        subMenu: [
            { name: 'Công đoạn', url: '/production/production-process/stage' },
            { name: 'Quy trình', url: '/production/production-process/production-process' },
        ],
    },
    productionCapacity: {
        name: 'Năng lực sản xuất',
        icon: 'icon-production-capacity',
        urls: ['/production/production-capacity'],
        subMenu: [
            { name: 'Tổ sản xuất', url: '/production/production-capacity/productionTeam' },
            { name: 'Máy móc', url: '/production/production-capacity/productionEquipment' },
            { name: 'Nhóm năng lực', url: '/production/production-capacity/productionCapacityGroup' },
            { name: 'Khuôn', url: '/production/production-capacity/productionPattern' },
        ],
    },
    otherCategories: {
        name: 'Danh mục khác',
        icon: 'icon-production-category',
        urls: ['/production/other-categories'],
        panel: {
            columns: [
                {
                    title: 'Đối tượng',
                    items: [
                        { name: 'Khách hàng', url: '/production/other-categories/customer' },
                        { name: 'Nhà cung cấp', url: '/production/other-categories/supplier' },
                        { name: 'Nhân viên', url: '/production/other-categories/employee' },
                        { name: 'Đối tượng tập hợp chi phí', url: '/production/other-categories/job' },
                    ]
                },
                {
                    title: 'Lịch làm việc',
                    items: [
                        { name: 'Ca làm việc', url: '/production/other-categories/shift' },
                        { name: 'Ngày lễ', url: '/production/other-categories/holiday-schedule' },
                        { name: 'Lịch làm việc', url: '/production/other-categories/work-schedule' },
                    ]
                },
                {
                    title: 'Khác',
                    items: [
                        { name: 'Cơ cấu tổ chức', url: '/production/other-categories/organization' },
                        { name: 'Kho', url: '/production/other-categories/stock' },
                        { name: 'Đơn vị tính', url: '/production/other-categories/unit' },
                        { name: 'Lý do dừng công việc', url: '/production/other-categories/reason' },
                        { name: 'Loại tiền', url: '/production/other-categories/currency' },
                    ]
                }
            ]
        }
    },
}

const isParentActive = (pathPrefix: string) => {
    // console.log('Checking active for path prefix:', pathPrefix, 'Current route path:', route.path);
    return route.path.startsWith(pathPrefix);
};

const isPanelActive = (urls: string[]) => {
    return urls.includes(route.path);
};

const groupExpandIndex = ref(-1);

const toggleExpandGroup = (index: number) => {
    // console.log('Toggling group expand for index:', index);
    if (groupExpandIndex.value === index) {
        groupExpandIndex.value = -1;
    } else {
        groupExpandIndex.value = index;
        console.log('Group expand set to index:', index);
    }
};

const calculateSubmenuHeight = (index: number) => {
    if (index === GROUP_PLAN_INDEX) {
        return PLAN_SUBMENU_HEIGHT;
    }

    if (index === GROUP_EXECUTION_INDEX) {
        return EXECUTION_SUBMENU_HEIGHT;
    }

    if (index === GROUP_PRODUCT_QUALITY_INDEX) {
        return PRODUCT_QUALITY_SUBMENU_HEIGHT;
    }

    if (index === GROUP_PRODUCTION_MATERIAL_INDEX) {
        return PRODUCTION_MATERIAL_SUBMENU_HEIGHT;
    }

    if (index === GROUP_DICTIONARY_INDEX) {
        return DICTIONARY_SUBMENU_HEIGHT;
    }

    if (index === GROUP_PRODUCTION_PROCESS_INDEX) {
        return PRODUCTION_PROCESS_SUBMENU_HEIGHT;
    }

    if (index === GROUP_PRODUCTION_CAPACITY_INDEX) {
        return PRODUCTION_CAPACITY_SUBMENU_HEIGHT;
    }

    return 0;
};

const autoExpandActiveMenu = () => {
    if (route.path.startsWith('/production/production-plan')) {
        groupExpandIndex.value = GROUP_PLAN_INDEX;
        return;
    }

    if (route.path.startsWith('/production/production-execution')) {
        groupExpandIndex.value = GROUP_EXECUTION_INDEX;
        return;
    }

    if (route.path.startsWith('/production/product-quality')) {
        groupExpandIndex.value = GROUP_PRODUCT_QUALITY_INDEX;
        return;
    }

    if (route.path.startsWith('/production/production-material')) {
        groupExpandIndex.value = GROUP_PRODUCTION_MATERIAL_INDEX;
        return;
    }

    if (route.path.startsWith('/production/dictionary')) {
        groupExpandIndex.value = GROUP_DICTIONARY_INDEX;
        return;
    }

    if (route.path.startsWith('/production/production-process')) {
        groupExpandIndex.value = GROUP_PRODUCTION_PROCESS_INDEX;
        return;
    }

    if (route.path.startsWith('/production/production-capacity')) {
        groupExpandIndex.value = GROUP_PRODUCTION_CAPACITY_INDEX;
        return;
    }
    groupExpandIndex.value = -1;
};

watch(() => route.path, () => {
    autoExpandActiveMenu();
}, { immediate: true });

// sub-menu bàn giao sản xuất
const handoverSubmenuOpen = ref(false);
const isHoveringHandoverMenu = ref(false);
let handoverCloseTimeout: ReturnType<typeof setTimeout> | null = null;
const closeHandoverSubmenu = () => {
    if (handoverCloseTimeout) clearTimeout(handoverCloseTimeout);
    handoverCloseTimeout = setTimeout(() => {
        if (!isHoveringHandoverMenu.value) {
            handoverSubmenuOpen.value = false;
        }
    }, 200);
};

const openHandoverSubmenu = () => {
    if (handoverCloseTimeout) clearTimeout(handoverCloseTimeout);
    handoverSubmenuOpen.value = true;
};

// sub-menu tieu chuan chat luong
const productQualitySubmenuOpen = ref(false);
const isHoveringProductQualityMenu = ref(false);
let productQualityCloseTimeout: ReturnType<typeof setTimeout> | null = null;
const closeProductQualitySubmenu = () => {
    if (productQualityCloseTimeout) clearTimeout(productQualityCloseTimeout);
    productQualityCloseTimeout = setTimeout(() => {
        if (!isHoveringProductQualityMenu.value) {
            productQualitySubmenuOpen.value = false;
        }
    }, 200);
};

const openProductQualitySubmenu = () => {
    if (productQualityCloseTimeout) clearTimeout(productQualityCloseTimeout);
    productQualitySubmenuOpen.value = true;
};

// sub-menu danh muc khac
const productOtherCategorySubmenuOpen = ref(false);
const isHoveringProductOtherCategoryMenu = ref(false);
let productOtherCategoryCloseTimeout: ReturnType<typeof setTimeout> | null = null;
const closeProductOtherCategorySubmenu = () => {
    if (productOtherCategoryCloseTimeout) clearTimeout(productOtherCategoryCloseTimeout);
    productOtherCategoryCloseTimeout = setTimeout(() => {
        if (!isHoveringProductOtherCategoryMenu.value) {
            productOtherCategorySubmenuOpen.value = false;
        }
    }, 200);
};

const openProductOtherCategorySubmenu = () => {
    if (productOtherCategoryCloseTimeout) clearTimeout(productOtherCategoryCloseTimeout);
    productOtherCategorySubmenuOpen.value = true;
};

const isSidebarExpanded = ref(false);

// hover sidebar logic
const isHoveringSidebar = ref(false);

const handleSidebarMouseLeave = () => {
    if (!props.isCollapsed) {
        return;
    }
    isHoveringSidebar.value = false;
    isSidebarExpanded.value = false;
};

const handleSidebarMouseEnter = () => {
    if (!props.isCollapsed) {
        return;
    }
    isHoveringSidebar.value = true;
    isSidebarExpanded.value = true;


};


</script>

<template lang="html">
    <div class="container" :class="{ 'ms-collapse': isCollapsed, 'ms-expanded': isSidebarExpanded }"
        @mouseleave="handleSidebarMouseLeave" @mouseenter="handleSidebarMouseEnter">
        <div class="menu-items relative">
            <router-link to="/production/dashboard" class="menu-item">
                <div class="icon-menu mi-qtsx icon20 icon-dashboard"></div>
                <div class="menu-item__text">Tổng quan</div>
            </router-link>

            <router-link to="/production/sale-order" class="menu-item">
                <div class="icon-menu mi-qtsx icon20 icon-order"></div>
                <div class="menu-item__text">Đơn đặt hàng</div>
            </router-link>

            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/production-plan'), 'group-expand': groupExpandIndex === GROUP_PLAN_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_PLAN_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-plan"></div>
                    <div class="menu-item__text">Kế hoạch sản xuất</div>
                    <div class="dropdown icon-menu mi-warehouse icon16 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_PLAN_INDEX && !isCollapsed || (groupExpandIndex === GROUP_PLAN_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_PLAN_INDEX)}px` : '0' }">
                    <router-link to="/production/production-plan/sale-order-plan" class="sub-menu__item"
                        v-tooltip.right="'Kế hoạch sản xuất theo đơn hàng'">
                        <div class="sub-menu__item__text">Kế hoạch theo đơn hàng</div>
                    </router-link>
                    <router-link to="/production/production-plan/overall-plan" class="sub-menu__item">
                        <div class="sub-menu__item__text">Kế hoạch tổng thể</div>
                    </router-link>
                    <router-link to="/production/production-plan/detail-plan" class="sub-menu__item">
                        <div class="sub-menu__item__text">Kế hoạch chi tiết</div>
                    </router-link>
                    <router-link to="/production/production-plan/material-plan" class="sub-menu__item"
                        v-tooltip.right="'Kế hoạch nguyên vật liệu'">
                        <div class="sub-menu__item__text">Kế hoạch nguyên vật liệu</div>
                    </router-link>
                    <router-link to="/production/production-plan/material-purchase-request" class="sub-menu__item">
                        <div class="sub-menu__item__text">Yêu cầu mua NVL</div>
                    </router-link>
                    <router-link to="/production/production-plan/purchase-order" class="sub-menu__item">
                        <div class="sub-menu__item__text">Đơn mua hàng</div>
                    </router-link>
                </div>
            </div>

            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/production-execution'), 'group-expand': groupExpandIndex === GROUP_EXECUTION_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_EXECUTION_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-power"></div>
                    <div class="menu-item__text">Điều phối và thực thi</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_EXECUTION_INDEX && !isCollapsed || (groupExpandIndex === GROUP_EXECUTION_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_EXECUTION_INDEX)}px` : '0' }">
                    <router-link to="/production/production-execution/order" class="sub-menu__item">
                        <div class="sub-menu__item__text">Lệnh sản xuất</div>
                    </router-link>
                    <router-link to="/production/production-execution/dismantle-order" class="sub-menu__item">
                        <div class="sub-menu__item__text">Lệnh tháo gỡ</div>
                    </router-link>
                    <router-link to="/production/production-execution/schedule" class="sub-menu__item">
                        <div class="sub-menu__item__text">Lịch sản xuất</div>
                    </router-link>
                    <router-link to="/production/production-execution/material-request" class="sub-menu__item">
                        <div class="sub-menu__item__text">Yêu cầu xuất vật tư</div>
                    </router-link>
                    <router-link to="/production/production-execution/statistics" class="sub-menu__item">
                        <div class="sub-menu__item__text">Thống kê sản xuất</div>
                    </router-link>
                    <router-link to="/production/production-execution/product-request" class="sub-menu__item"
                        v-tooltip.right="'Yêu cầu nhập thành phẩm, nguyên vật liệu thừa'">
                        <div class="sub-menu__item__text">Yêu cầu nhập thành phầm, nguyên vật liệu thừa</div>
                    </router-link>
                    <div class="sub-menu__item relative group" @mouseenter="openHandoverSubmenu" :class="{
                        'active-sub-panel-parent': isPanelActive(['/production/production-execution/handover', '/production/production-execution/handoverreturn'])
                    }" @mouseleave="handoverSubmenuOpen = false;">
                        <div class="sub-menu__item__text"
                            v-tooltip.top-start="'Bàn giao sản phẩm, nguyên vật liệu thừa'">Bàn giao bán thành phẩm
                        </div>
                        <div class="dropdown icon-menu mi-warehouse icon20 icon-chevron-right"></div>
                        <!-- Sub-menu panel for handover  -->
                        <div v-if="handoverSubmenuOpen"
                            @mouseenter="isHoveringHandoverMenu = true; openHandoverSubmenu()"
                            @mouseleave="handoverSubmenuOpen = false"
                            class="sub-menu-panel-container transition-opacity">
                            <div class="sub-menu-panel bg-white p-2">
                                <div class="sub-menu-panel__section">
                                    <router-link to="/production/production-execution/handover"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Bàn giao</div>
                                    </router-link>
                                    <router-link to="/production/production-execution/handoverreturn"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Trả lại</div>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <router-link to="/production/production-execution/handover-overview" class="sub-menu__item"
                        v-tooltip.right="'Tình hình bàn giao sản xuất'">
                        <div class="sub-menu__item__text">Tình hình bàn giao sản xuất</div>
                    </router-link>
                </div>
            </div>

            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/product-quality'), 'group-expand': groupExpandIndex === GROUP_PRODUCT_QUALITY_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_PRODUCT_QUALITY_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-quality-control"></div>
                    <div class="menu-item__text">Kiểm tra chất lượng</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_PRODUCT_QUALITY_INDEX && !isCollapsed || (groupExpandIndex === GROUP_PRODUCT_QUALITY_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_PRODUCT_QUALITY_INDEX)}px` : '0' }">
                    <router-link to="/production/product-quality/quality-check-request" class="sub-menu__item">
                        <div class="sub-menu__item__text">Yêu cầu kiểm tra</div>
                    </router-link>
                    <router-link to="/production/product-quality/inspection-voucher" class="sub-menu__item">
                        <div class="sub-menu__item__text">Phiếu kiểm tra</div>
                    </router-link>
                    <div class="sub-menu__item relative group" :class="{
                        'active-sub-panel-parent': isPanelActive(['/production/product-quality/criteria', '/production/product-quality/criteria-group', '/production/product-quality/sampling-method', '/production/product-quality/quality-standard', '/production/product-quality/quality-error', '/production/product-quality/quality-error-group'])
                    }" @mouseenter="openProductQualitySubmenu" @mouseleave="productQualitySubmenuOpen = false;">
                        <div class="sub-menu__item__text">Tiêu chuẩn</div>
                        <div class="icon-menu mi-warehouse icon20 icon-chevron-right"></div>
                        <!-- Sub-menu panel for handover  -->
                        <div v-if="productQualitySubmenuOpen"
                            @mouseenter="isHoveringProductQualityMenu = true; openProductQualitySubmenu()"
                            @mouseleave="productQualitySubmenuOpen = false;"
                            class="sub-menu-panel-container transition-opacity">
                            <div class="sub-menu-panel bg-white p-2">
                                <div class="sub-menu-panel__section">
                                    <router-link to="/production/product-quality/criteria" class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Tiêu chí chất lượng</div>
                                    </router-link>
                                    <router-link to="/production/product-quality/criteria-group"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Nhóm tiêu chí chất lượng</div>
                                    </router-link>
                                    <router-link to="/production/product-quality/sampling-method"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Phương pháp chọn mẫu</div>
                                    </router-link>
                                    <router-link to="/production/product-quality/quality-standard"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Bộ tiêu chuẩn kiểm tra chất lượng</div>
                                    </router-link>
                                    <router-link to="/production/product-quality/quality-error"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Lỗi kiểm tra chất lượng</div>
                                    </router-link>
                                    <router-link to="/production/product-quality/quality-error-group"
                                        class="sub-menu-panel__item">
                                        <div class="sub-menu-panel__item__text">Nhóm lỗi kiểm tra chất lượng</div>
                                    </router-link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/production-material'), 'group-expand': groupExpandIndex === GROUP_PRODUCTION_MATERIAL_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_PRODUCTION_MATERIAL_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-material-factory"></div>
                    <div class="menu-item__text">Kho vật tư</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_PRODUCTION_MATERIAL_INDEX && !isCollapsed || (groupExpandIndex === GROUP_PRODUCTION_MATERIAL_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_PRODUCTION_MATERIAL_INDEX)}px` : '0' }">
                    <router-link to="/production/production-material/request-material" class="sub-menu__item"
                        v-tooltip.right="'Đề nghị kho cấp vật tư'">
                        <div class="sub-menu__item__text">Đề nghị kho cấp vật tư</div>
                    </router-link>
                    <router-link to="/production/production-material/factory-inward" class="sub-menu__item">
                        <div class="sub-menu__item__text">Nhập kho</div>
                    </router-link>
                    <router-link to="/production/production-material/export-material" class="sub-menu__item">
                        <div class="sub-menu__item__text">Xuất kho</div>
                    </router-link>
                    <router-link to="/production/production-material/transfer-material" class="sub-menu__item">
                        <div class="sub-menu__item__text">Điều chuyển</div>
                    </router-link>
                    <router-link to="/production/production-material/opn-inventory-stock" class="sub-menu__item">
                        <div class="sub-menu__item__text">Tồn kho đầu kỳ</div>
                    </router-link>
                </div>
            </div>

            <div class="menu-item-line"></div>

            <router-link to="/production/reportlist" class="menu-item">
                <div class="icon-menu mi-qtsx icon20 icon-production-report"></div>
                <div class="menu-item__text">Báo cáo</div>
            </router-link>

            <div class="menu-item-line"></div>

            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/dictionary'), 'group-expand': groupExpandIndex === GROUP_DICTIONARY_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_DICTIONARY_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-product-material"></div>
                    <div class="menu-item__text">Sản phẩm, NVL</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_DICTIONARY_INDEX && !isCollapsed || (groupExpandIndex === GROUP_DICTIONARY_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_DICTIONARY_INDEX)}px` : '0' }">
                    <router-link to="/production/dictionary/inventoryitem" class="sub-menu__item">
                        <div class="sub-menu__item__text">Vật tư hàng hóa</div>
                    </router-link>
                    <router-link to="/production/dictionary/inventoryitemgroup" class="sub-menu__item"
                        v-tooltip.right="'Nhóm vật tư hàng hóa'">
                        <div class="sub-menu__item__text">Nhóm vật tư hàng hóa</div>
                    </router-link>
                    <router-link to="/production/dictionary/billOfMaterials" class="sub-menu__item"
                        v-tooltip.right="'Định mức nguyên vật liệu'">
                        <div class="sub-menu__item__text">Định mức nguyên vật liệu</div>
                    </router-link>
                    <router-link to="/production/dictionary/billOfDisassembly" class="sub-menu__item">
                        <div class="sub-menu__item__text">Định mức tháo dỡ</div>
                    </router-link>
                    <router-link to="/production/dictionary/alternativeMaterialList" class="sub-menu__item"
                        v-tooltip.right="'Danh sách nguyên vật liệu thay thế'">
                        <div class="sub-menu__item__text">Nguyên vật liệu thay thế</div>
                    </router-link>
                </div>
            </div>

            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/production-process'), 'group-expand': groupExpandIndex === GROUP_PRODUCTION_PROCESS_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_PRODUCTION_PROCESS_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-process"></div>
                    <div class="menu-item__text">Quy trình</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_PRODUCTION_PROCESS_INDEX && !isCollapsed || (groupExpandIndex === GROUP_PRODUCTION_PROCESS_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_PRODUCTION_PROCESS_INDEX)}px` : '0' }">
                    <router-link to="/production/production-process/stage" class="sub-menu__item">
                        <div class="sub-menu__item__text">Công đoạn</div>
                    </router-link>
                    <router-link to="/production/production-process/production-process" class="sub-menu__item">
                        <div class="sub-menu__item__text">Quy trình</div>
                    </router-link>
                </div>
            </div>

            <div class="menu-group-items"
                :class="{ 'active-parent': isParentActive('/production/production-capacity'), 'group-expand': groupExpandIndex === GROUP_PRODUCTION_CAPACITY_INDEX }">
                <div class="menu-item" @click="toggleExpandGroup(GROUP_PRODUCTION_CAPACITY_INDEX)">
                    <div class="icon-menu mi-qtsx icon20 icon-production-capacity"></div>
                    <div class="menu-item__text">Năng lực sản xuất</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu"
                    :style="{ height: groupExpandIndex === GROUP_PRODUCTION_CAPACITY_INDEX && !isCollapsed || (groupExpandIndex === GROUP_PRODUCTION_CAPACITY_INDEX && isSidebarExpanded) ? `${calculateSubmenuHeight(GROUP_PRODUCTION_CAPACITY_INDEX)}px` : '0' }">
                    <router-link to="/production/production-capacity/productionTeam" class="sub-menu__item">
                        <div class="sub-menu__item__text">Tổ sản xuất</div>
                    </router-link>
                    <router-link to="/production/production-capacity/productionEquipment" class="sub-menu__item">
                        <div class="sub-menu__item__text">Máy móc</div>
                    </router-link>
                    <router-link to="/production/production-capacity/productionCapacityGroup" class="sub-menu__item">
                        <div class="sub-menu__item__text">Nhóm năng lực</div>
                    </router-link>
                    <router-link to="/production/production-capacity/productionPattern" class="sub-menu__item">
                        <div class="sub-menu__item__text">Khuôn</div>
                    </router-link>
                </div>
            </div>

            <div class="menu-group-items relative group" @mouseenter="openProductOtherCategorySubmenu"
                @mouseleave="productOtherCategorySubmenuOpen = false;"
                :class="{ 'active-sub-panel-parent': isParentActive('/production/other-categories') }">
                <div class="menu-item ">
                    <div class="icon-menu mi-qtsx icon20 icon-production-category"></div>
                    <div class="menu-item__text">Danh mục khác</div>
                    <div class="dropdown icon-menu mi-warehouse icon20 icon-chevron-right"></div>
                </div>
                <!-- Sub-menu panel for handover  -->
                <div v-if="productOtherCategorySubmenuOpen"
                    @mouseenter="isHoveringProductOtherCategoryMenu = true; openProductOtherCategorySubmenu()"
                    @mouseleave="productOtherCategorySubmenuOpen = false;"
                    class="sub-menu-panel-container transition-opacity">
                    <div class="sub-menu-panel bg-white p-2">
                        <div class="flex gap-2">
                            <!-- Objects -->
                            <div class="sub-menu-panel__section">
                                <div class="sub-menu-panel__title">Đối tượng</div>
                                <router-link to="/production/other-categories/customer" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Khách hàng</div>
                                </router-link>
                                <router-link to="/production/other-categories/supplier" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Nhà cung cấp</div>
                                </router-link>
                                <router-link to="/production/other-categories/employee" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Nhân viên</div>
                                </router-link>
                                <router-link to="/production/other-categories/job" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Đối tượng tập hợp chi phí</div>
                                </router-link>
                            </div>
                            <div class="sub-menu-panel__section">
                                <div class="sub-menu-panel__title">Lịch làm việc</div>
                                <router-link to="/production/other-categories/shift" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Ca làm việc</div>
                                </router-link>
                                <router-link to="/production/other-categories/holiday-schedule"
                                    class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Ngày nghỉ</div>
                                </router-link>
                                <router-link to="/production/other-categories/work-schedule"
                                    class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Lịch làm việc</div>
                                </router-link>
                            </div>
                            <div class="sub-menu-panel__section">
                                <div class="sub-menu-panel__title">Khác</div>
                                <router-link to="/production/other-categories/organization"
                                    class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Cơ cấu tổ chức</div>
                                </router-link>
                                <router-link to="/production/other-categories/stock" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Kho</div>
                                </router-link>
                                <router-link to="/production/other-categories/unit" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Đơn vị tính</div>
                                </router-link>
                                <router-link to="/production/other-categories/reason" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Lý do dừng công việc</div>
                                </router-link>
                                <router-link to="/production/other-categories/currency" class="sub-menu-panel__item">
                                    <div class="sub-menu-panel__item__text">Loại tiền</div>
                                </router-link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
        <!-- Footer -->
        <div class="sidebar-footer">
            <div class="collapse-btn" @click="toggleCollapse">
                <div class="icon-menu mi-warehouse icon20 icon-chevron-right"></div>
                <div class="collapse-btn__text">{{ !isCollapsed ? 'Thu gọn' : 'Mở rộng' }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background: var(--bg);
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    position: relative;
}

.container.ms-expanded {
    width: 248px !important;
    z-index: 1000 !important;
    background: var(--bg) !important;

    .menu-item__text {
        display: block !important;
    }

    .dropdown {
        display: block !important;
    }

    .menu-item {
        justify-content: flex-start;
        padding: 6px !important;

        .icon-menu {
            margin-left: 0 !important;
        }
    }

    .sidebar-footer {
        .collapse-btn {
            justify-content: center !important;
        }

        .collapse-btn__text {
            display: block !important;
        }

        .icon-chevron-right {
            rotate: 180deg;
            margin-left: 6px;
        }
    }

    .sub-menu {
        .sub-menu__item {
            display: flex !important;
        }
    }

    .menu-group-items {
        .sub-menu__item {
            opacity: 1 !important;
            visibility: visible !important;
        }
    }
}

.container.ms-collapse {
    width: 64px;

    .menu-item__text {
        display: none;
    }

    .dropdown {
        display: none;
    }

    .menu-item {
        justify-content: flex-start;
        padding: 6px;

        // .icon-menu {
        //     margin-left: 6px;
        // }
    }

    .sidebar-footer {
        .collapse-btn {
            justify-content: flex-start;
        }

        .collapse-btn__text {
            display: none;
        }

        .icon-chevron-right {
            rotate: 0deg;
            margin-left: 6px;
        }
    }

    .sub-menu {
        // .sub-menu__item {
        //     display: none;
        // }
    }

    .menu-group-items {

        &:hover {
            .sub-menu__item {
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important;
                overflow: visible !important;
            }
        }

        .sub-menu__item {
            opacity: 0;
            visibility: hidden;
            overflow: clip;
        }
    }
}

.icon-menu {
    margin-left: 0;
    // transition: margin 0.3s ease;
}

.menu-items {
    display: flex;
    flex-direction: column;
    padding: 16px;
    row-gap: 8px;
    // overflow-y: auto;
    // overflow-x: visible;
    flex: 1;
    min-height: 0;
    scrollbar-width: none;
}

.menu-item {
    position: relative;
    padding: 6px;
    height: 32px;
    font-size: 13px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    width: 100%;
    cursor: pointer;
    color: var(--text);
}

.menu-item__text {
    color: #101828;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // max-width: 170px;
    // min-width: 132px;
    width: 0;
    flex: 1;
}

.menu-item .icon-dropdown-up {
    rotate: 180deg;
    transition: rotate 0.3s ease;
}

.menu-item:hover {
    background: rgba(0, 0, 0, .05);
    border-radius: 8px;
}

.menu-group-items {}

.menu-group-items .sub-menu {
    display: flex;
    flex-direction: column;
    opacity: 0;
    overflow: hidden;
    transition: height 0.3s ease, opacity 0.3s ease;
}

.menu-group-items.group-expand {
    .sub-menu {
        opacity: 1;
        overflow: visible;
    }

    .menu-item .icon-dropdown-up {
        rotate: 0deg;
    }

}

.menu-group-items .sub-menu__item {
    height: 32px;
    display: flex;
    align-items: center;
    padding: 8px 8px;
    padding-left: 40px;
    border-radius: 8px;
    margin-top: 4px;
    cursor: pointer;
}

.menu-group-items .sub-menu__item__text {
    font-size: 13px;
    color: #101828;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 170px;
    min-width: 132px;
    width: 0;
    // flex: 1;
    margin-right: auto;
}

.menu-group-items .sub-menu__item:hover {
    background: rgba(0, 0, 0, .05);
}

.active-parent .menu-item {
    .menu-item__text {
        color: var(--primary-color);
    }

    .icon-menu {
        background-color: var(--primary-color);
    }
}

.active-sub-panel-parent {
    background: #E6F5EF !important;
    border-radius: 8px !important;

    .sub-menu__item__text {
        color: var(--primary-color);
    }

    .menu-item__text {
        color: var(--primary-color) !important;
    }

    .icon-menu {
        background-color: var(--primary-color);
    }


}


.active {
    background: #E6F5EF !important;
    border-radius: 8px !important;

    .menu-item__text {
        color: var(--primary-color) !important;
    }

    .icon-menu {
        background-color: var(--primary-color) !important;
    }
}

.router-link-active {
    background: #E6F5EF !important;
    border-radius: 8px !important;

    .menu-item__text {
        color: var(--primary-color) !important;
    }

    .icon-menu {
        background-color: var(--primary-color) !important;
    }

    .sub-menu__item__text {
        color: var(--primary-color) !important;
    }
}

// Panel menu
.sub-menu-panel-container {
    position: absolute;
    top: -25px;
    left: 100%;
    padding: 25px;
    z-index: 100;
    width: max-content;
    cursor: default;
}

.sub-menu-panel {
    border: 1px solid #E9EAEB;
    border-radius: 8px;
}

.sub-menu-panel__section {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
}

.sub-menu-panel__title {
    height: 32px;
    font-size: 13px;
    width: 100%;
    line-height: 14px;
    font-weight: 600;
    justify-content: flex-start;
    padding: 0 32px;
    background: transparent;
    border: none;
    outline: none;
    text-align: left;
    align-items: center;
    display: flex;
}

.sub-menu-panel__item {
    height: 32px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    width: 100%;
    cursor: pointer;
    justify-content: flex-start;
    padding: 0 32px;
    align-items: center;
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    text-align: left;
}

.sub-menu-panel__item__text {
    font-weight: 400;
    font-size: 13px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sub-menu-panel__item:hover {
    background: rgba(0, 0, 0, .05);
    border-radius: 4px;
}

.sub-menu-panel__item.router-link-active {
    background: #E6F5EF;
    border-radius: 4px !important;

    .sub-menu-panel__item__text {
        color: var(--primary-color);
    }
}

//Menu item line
.menu-item-line {
    margin: 4px auto;
    width: 100%;
    border-bottom: 1px solid #E9EAEB;
}

//sidebar-footer
.sidebar-footer {
    padding: 16px;
}

//Collapse button
.collapse-btn {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid #E9EAEB;
    overflow: hidden;

    &:hover {
        background: rgba(0, 0, 0, .05);
    }

    .icon-menu {
        background-color: var(--text);
        rotate: -180deg;
        transition: rotate 0.3s ease;
    }

    .collapse-btn__text {
        font-size: 13px;
        color: var(--text);
        margin-left: 8px;
        white-space: nowrap;
    }
}
</style>