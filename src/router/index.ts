import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/production/dictionary/shift',
        component: () => import('../views/production/other-categories/Shift.vue'),
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

    //production-execution
    {
        path: '/production/production-execution/order',
        component: () => import('../views/production/production-execution/Order.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/dismantle-order',
        component: () => import('../views/production/production-execution/DismantleOrder.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/schedule',
        component: () => import('../views/production/production-execution/Schedule.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/material-request',
        component: () => import('../views/production/production-execution/MaterialRequest.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/statistics',
        component: () => import('../views/production/production-execution/Statistics.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/product-request',
        component: () => import('../views/production/production-execution/ProductRequest.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/handover',
        component: () => import('../views/production/production-execution/Handover.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/handoverreturn',
        component: () => import('../views/production/production-execution/HandoverReturn.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-execution/handover-overview',
        component: () => import('../views/production/production-execution/HandoverOverview.vue'),
        meta: { layout: 'ProductionLayout' }
    },

    //product-quality/criteria
    {
        path: '/production/product-quality/criteria',
        component: () => import('../views/production/product-quality/Criteria.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/quality-check-request',
        component: () => import('../views/production/product-quality/QualityCheckRequest.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/inspection-voucher',
        component: () => import('../views/production/product-quality/InspectionVoucher.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/criteria-group',
        component: () => import('../views/production/product-quality/CriteriaGroup.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/sampling-method',
        component: () => import('../views/production/product-quality/SamplingMethod.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/quality-standard',
        component: () => import('../views/production/product-quality/QualityStandard.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/quality-error',
        component: () => import('../views/production/product-quality/QualityError.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/product-quality/quality-error-group',
        component: () => import('../views/production/product-quality/QualityErrorGroup.vue'),
        meta: { layout: 'ProductionLayout' }
    },

    //Other categories
    {
        path: '/production/other-categories/shift',
        component: () => import('../views/production/other-categories/Shift.vue'),
        meta: { layout: 'ProductionLayout' }
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})