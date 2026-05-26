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

    //production-material
    {
        path: '/production/production-material/request-material',
        component: () => import('../views/production/production-material/RequestMaterial.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-material/export-material',
        component: () => import('../views/production/production-material/ExportMaterial.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-material/factory-inward',
        component: () => import('../views/production/production-material/FactoryInward.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-material/opn-inventory-stock',
        component: () => import('../views/production/production-material/OpenInventoryStock.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-material/transfer-material',
        component: () => import('../views/production/production-material/TransferMaterial.vue'),
        meta: { layout: 'ProductionLayout' }
    },

    //dictionary
    {
        path: '/production/dictionary/inventoryitem',
        component: () => import('../views/production/dictionary/InventoryItem.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/dictionary/inventoryitemgroup',
        component: () => import('../views/production/dictionary/InventoryItemGroup.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/dictionary/billOfMaterials',
        component: () => import('../views/production/dictionary/BillOfMaterials.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/dictionary/billOfDisassembly',
        component: () => import('../views/production/dictionary/BillOfDisassembly.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/dictionary/alternativeMaterialList',
        component: () => import('../views/production/dictionary/AlternativeMaterialList.vue'),
        meta: { layout: 'ProductionLayout' }
    },

    //production-process
    {
        path: '/production/production-process/stage',
        component: () => import('../views/production/production-process/Stage.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-process/production-process',
        component: () => import('../views/production/production-process/ProductionProcess.vue'),
        meta: { layout: 'ProductionLayout' }
    },

    //production-capacity
    {
        path: '/production/production-capacity/productionTeam',
        component: () => import('../views/production/production-capacity/ProductionTeam.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-capacity/productionEquipment',
        component: () => import('../views/production/production-capacity/ProductionEquipment.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-capacity/productionCapacityGroup',
        component: () => import('../views/production/production-capacity/ProductionCapacityGroup.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/production-capacity/productionPattern',
        component: () => import('../views/production/production-capacity/ProductionPattern.vue'),
        meta: { layout: 'ProductionLayout' }
    },


    //Other categories
    {
        path: '/production/other-categories/currency',
        component: () => import('../views/production/other-categories/Currency.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/customer',
        component: () => import('../views/production/other-categories/Customer.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/employee',
        component: () => import('../views/production/other-categories/Employee.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/holiday-schedule',
        component: () => import('../views/production/other-categories/HolidaySchedule.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/job',
        component: () => import('../views/production/other-categories/Job.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/organization',
        component: () => import('../views/production/other-categories/Organization.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/reason',
        component: () => import('../views/production/other-categories/Reason.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/shift',
        component: () => import('../views/production/other-categories/Shift.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/stock',
        component: () => import('../views/production/other-categories/Stock.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/supplier',
        component: () => import('../views/production/other-categories/Supplier.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/unit',
        component: () => import('../views/production/other-categories/Unit.vue'),
        meta: { layout: 'ProductionLayout' }
    },
    {
        path: '/production/other-categories/work-schedule',
        component: () => import('../views/production/other-categories/WorkSchedule.vue'),
        meta: { layout: 'ProductionLayout' }
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})