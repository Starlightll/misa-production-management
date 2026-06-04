<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '../components/modules/production/Navbar.vue';
import Sidebar from '../components/modules/production/Sidebar.vue';
const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true');
const isExpanded = ref(false);

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
    localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString());
    console.log('Sidebar collapsed:', isCollapsed.value);
};

const collapseOnHover = () => {
    if (isExpanded.value) {
        isExpanded.value = false;
    }
};

</script>

<template>
    <div class="layout-container">
        <div class="header-container">
            <Navbar />
        </div>
        <div class="main" :class="{ 'ms-collapse': isCollapsed }">
            <div class="main-left" @mouseenter="isExpanded = true" @mouseleave="collapseOnHover">
                <Sidebar class="sidebar" :isCollapsed="isCollapsed" @toggleCollapse="toggleCollapse" />
            </div>
            <main class="main-right">
                <slot /> <!-- View sẽ nằm ở đây -->
            </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100%;
}

.header-container {
    height: 48px;
    background: var(--primary-color);
    color: white;
}

.main {
    display: flex;
    height: calc(100% - 48px);
    max-height: calc(100vh - 48px);
    flex: 1;
}

.main.ms-collapse .main-left {
    width: 64px;
}

// .main.ms-collapse .main-left:hover .sidebar {
//     width: 248px;
//     z-index: 100;
//     position: absolute;
// }

.main-left {
    width: 248px;
    background: var(--bg);
    transition: width 0.3s ease;
}

.main-right {
    flex: 1;
    // padding: 20px;
    background: var(--bg-dark);
    width: calc(100% - 248px);
}
</style>