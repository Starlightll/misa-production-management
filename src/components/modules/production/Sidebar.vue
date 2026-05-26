<script setup lang="ts">
import { computed, onBeforeMount, onMounted, watch } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps<{
    isCollapsed: boolean;
}>();

const route = useRoute();

const menuItems = [
    {
        name: 'Tổng quan',
        icon: 'icon-dashboard',
        route: '/production/dashboard',
        type: 'single',
    },
    {
        name: 'Đơn đặt hàng',
        icon: 'icon-order',
        route: '/production/sale-order',
        type: 'single',
    },
    {
        name: 'Kế hoạch sản xuất',
        icon: 'icon-plan',
        route: '/production/production-plan',
        type: 'group',
        subMenu: [
            { name: 'Kế hoạch theo đơn hàng', route: '/production/production-plan/sale-order-plan' },
            { name: 'Kế hoạch tổng thể', route: '/production/production-plan/overall-plan' },
            { name: 'Kế hoạch chi tiết', route: '/production/production-plan/detail-plan' },
            { name: 'Kế hoạch nguyên vật liệu', route: '/production/production-plan/material-plan' },
            { name: 'Yêu cầu mua NVL', route: '/production/production-plan/material-purchase-request' },
            { name: 'Đơn mua hàng', route: '/production/production-plan/purchase-order' },
        ],
    },
    {
        name: 'Điều phối và thực thi',
        icon: 'icon-power',
        route: '/production/production-execution',
        type: 'group',
        subMenu: [
            { name: 'Lệnh sản xuất', route: '/production/production-execution/order' },
            { name: 'Lệnh tháo gỡ', route: '/production/production-execution/dismantle-order' },
            { name: 'Lịch sản xuất', route: '/production/production-execution/schedule' },
            { name: 'Yêu cầu xuất vật tư', route: '/production/production-execution/material-request' },
            { name: 'Thống kê sản xuất', route: '/production/production-execution/statistics' },
            { name: 'Yêu cầu nhập thành phầm, nguyên vật liệu thừa', route: '/production/production-execution/product-request' },
            {
                name: 'Bàn giao bán thành phẩm', route: '/production/production-execution/product-request', type: 'panel',
                panel: [
                    {
                        column: {
                            title: 'Bàn giao',
                            items: [
                                { name: 'Bàn giao', route: '/production/production-execution/handover-create' },
                                { name: 'Trả lại', route: '/production/production-execution/handover-list' },
                            ]
                        }
                    }
                ]
            },
            { name: 'Tình hình bàn giao sản xuất', route: '/production/production-execution/handover-overview' },
        ],
    },
];

const isParentActive = (pathPrefix: string) => {
    return route.path.startsWith(pathPrefix);
};

const groupExpandIndex = ref(-1);

const toggleExpandGroup = (index: number) => {
    if (groupExpandIndex.value === index) {
        groupExpandIndex.value = -1;
    } else {
        groupExpandIndex.value = index;

    }
    console.log('groupExpandIndex', groupExpandIndex.value);
};


const calculateSubmenuHeight = (index: number) => {
    const item = menuItems[index];
    if (item.subMenu) {
        return item.subMenu.length * 36; // Giả sử mỗi sub-menu có chiều cao 36px
    }
    return 0;
};


//Kiểm tra nếu route hiện tại thuộc về một nhóm menu nào đó thì tự động mở nhóm đó ra
// Hàm kiểm tra xem route hiện tại có thuộc về subMenu nào không để tự động mở rộng
const autoExpandActiveMenu = () => {
    const currentPath = route.path;

    // Tìm index của menu cha chứa subMenu có route trùng với route hiện tại
    const activeGroupIndex = menuItems.findIndex(item => {
        if (item.subMenu) {
            return item.subMenu.some(subItem => subItem.route === currentPath);
        }
        return false;
    });

    // Nếu tìm thấy, gán index đó cho groupExpandIndex để mở menu ra
    if (activeGroupIndex !== -1) {
        groupExpandIndex.value = activeGroupIndex;
    }
};

// 1. Chạy ngay khi component được mounted (Giải quyết vấn đề Tải lại trang / F5)
onMounted(() => {
    autoExpandActiveMenu();
});

// 2. Theo dõi sự thay đổi của Route (Giải quyết vấn đề khi bấm chuyển trang/back/forward)
watch(() => route.path, () => {
    autoExpandActiveMenu();
});


</script>

<template lang="html">
    <div class="container" :class="{ 'ms-collapse': isCollapsed }">
        <div class="menu-items">
            <template v-for="(item, index) in menuItems" :key="index">
                <router-link v-if="item.type === 'single'" :to="item.route" class="menu-item">
                    <div :class="['icon-menu', 'mi-qtsx', 'icon20', item.icon]"></div>
                    <div class="menu-item__text">{{ item.name }}</div>
                </router-link>
                <div v-if="item.type === 'group'" class="menu-group-items"
                    :class="{ 'active-parent': isParentActive(item.route), 'group-expand': groupExpandIndex === index }">
                    <div class="menu-item" @click="toggleExpandGroup(index)">
                        <div :class="['icon-menu', 'mi-qtsx', 'icon20', item.icon]"></div>
                        <div class="menu-item__text">{{ item.name }}</div>
                        <div class="icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                    </div>
                    <div class="sub-menu"
                        :style="{ height: groupExpandIndex === index ? `${calculateSubmenuHeight(index)}px` : '0' }">
                        <template v-for="(subItem, subIndex) in item.subMenu" :key="subIndex">
                            <router-link :to="subItem.route" @click.stop="groupExpandIndex === index"
                                class="sub-menu__item">
                                <div class="sub-menu__item__text">{{ subItem.name }}</div>
                                <div v-if="subItem.type === 'panel'"
                                    class="icon-menu mi-warehouse icon20 icon-chevron-right"></div>
                            </router-link>
                        </template>
                    </div>
                </div>
            </template>
            <!-- <router-link to="/production/dashboard" class="menu-item">
                <div class="icon-menu mi-qtsx icon20 icon-dashboard"></div>
                <div class="menu-item__text">Tổng quan</div>
            </router-link>
            <router-link to="/production/sale-order" class="menu-item active">
                <div class="icon-menu mi-qtsx icon20 icon-order"></div>
                <div class="menu-item__text">Đơn đặt hàng</div>
            </router-link>
            <div class="menu-group-items active-parent">
                <div class="menu-item">
                    <div class="icon-menu mi-qtsx icon20 icon-plan"></div>
                    <div class="menu-item__text">Kế hoạch sản xuất</div>
                    <div class="icon-menu mi-warehouse icon20 icon-dropdown-up"></div>
                </div>
                <div class="sub-menu">
                    <div class="sub-menu__item">
                        <div class="sub-menu__item__text">Kế hoạch theo đơn hàng</div>
                    </div>
                    <div class="sub-menu__item">
                        <div class="sub-menu__item__text">Kế hoạch tổng thể</div>
                    </div>
                    <div class="sub-menu__item">
                        <div class="sub-menu__item__text">Kế hoạch chi tiết</div>
                    </div>
                    <div class="sub-menu__item">
                        <div class="sub-menu__item__text">Kế hoạch nguyên vật liệu</div>
                    </div>
                    <div class="sub-menu__item">
                        <div class="sub-menu__item__text">Yêu cầu mua NVL</div>
                    </div>
                    <div class="sub-menu__item">
                        <div class="sub-menu__item__text">Đơn mua hàng</div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background: var(--bg);
    transition: width 0.3s ease;
}

.menu-items {
    display: flex;
    flex-direction: column;
    padding: 16px;
    row-gap: 8px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    min-height: 0;
    scrollbar-width: none;
}

.menu-item {
    position: relative;
    padding: 8px 12px;
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
    }

    .menu-item .icon-dropdown-up {
        rotate: 0deg;
    }

}

.menu-group-items .sub-menu__item {
    height: 32px;
    display: flex;
    align-items: center;
    padding: 8px 12px;
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

.menu-group-items .active-parent .sub-menu {
    opacity: 1;
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
</style>