import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/production/dictionary/shift',
        component: () => import('../views/production/dictionary/Shift.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/dashboard',
        component: () => import('../views/production/Dashboard.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/sale-order',
        component: () => import('../views/production/SaleOrder.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    // Production Plan
    {
        path: '/production/production-plan/detail-plan',
        component: () => import('../views/production/production-plan/DetailPlan.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-plan/material-plan',
        component: () => import('../views/production/production-plan/MaterialPlan.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-plan/material-purchase-request',
        component: () => import('../views/production/production-plan/MaterialPurchaseRequest.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-plan/overall-plan',
        component: () => import('../views/production/production-plan/OverallPlan.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-plan/purchase-order',
        component: () => import('../views/production/production-plan/PurchaseOrder.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-plan/sale-order-plan',
        component: () => import('../views/production/production-plan/SaleOrderPlan.vue'),
        meta: { layout: 'ProductionLayout' }
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})