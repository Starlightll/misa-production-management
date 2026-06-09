import { createRouter, createWebHistory } from 'vue-router'
const appName = 'AMIS Sản Xuất';

const routes = [
    {
        path: '/production/dashboard',
        component: () => import('../views/production/Dashboard.vue'),
        meta: { layout: 'ProductionLayout', title: `Tổng quan | ${appName}` }
    },
    {
        path: '/production/sale-order',
        component: () => import('../views/production/SaleOrder.vue'),
        meta: { layout: 'ProductionLayout', title: `Đơn đặt hàng | ${appName}` }
    },
    // Production Plan
    {
        path: '/production/production-plan/detail-plan',
        component: () => import('../views/production/production-plan/DetailPlan.vue'),
        meta: { layout: 'ProductionLayout', title: `Kế hoạch chi tiết | ${appName}` }
    },
    {
        path: '/production/production-plan/material-plan',
        component: () => import('../views/production/production-plan/MaterialPlan.vue'),
        meta: { layout: 'ProductionLayout', title: `Kế hoạch nguyên vật liệu | ${appName}` }
    },
    {
        path: '/production/production-plan/material-purchase-request',
        component: () => import('../views/production/production-plan/MaterialPurchaseRequest.vue'),
        meta: { layout: 'ProductionLayout', title: `Yêu cầu mua nguyên vật liệu | ${appName}` }
    },
    {
        path: '/production/production-plan/overall-plan',
        component: () => import('../views/production/production-plan/OverallPlan.vue'),
        meta: { layout: 'ProductionLayout', title: `Kế hoạch sản xuất tổng thể | ${appName}` }
    },
    {
        path: '/production/production-plan/purchase-order',
        component: () => import('../views/production/production-plan/PurchaseOrder.vue'),
        meta: { layout: 'ProductionLayout', title: `Đơn mua hàng | ${appName}` }
    },
    {
        path: '/production/production-plan/sale-order-plan',
        component: () => import('../views/production/production-plan/SaleOrderPlan.vue'),
        meta: { layout: 'ProductionLayout', title: `kế hoạch theo đơn đặt hàng | ${appName}` }
    },

    //production-execution
    {
        path: '/production/production-execution/order',
        component: () => import('../views/production/production-execution/Order.vue'),
        meta: { layout: 'ProductionLayout', title: `Lệnh sản xuất | ${appName}` }
    },
    {
        path: '/production/production-execution/dismantle-order',
        component: () => import('../views/production/production-execution/DismantleOrder.vue'),
        meta: { layout: 'ProductionLayout', title: `Lệnh tháo dỡ | ${appName}` }
    },
    {
        path: '/production/production-execution/schedule',
        component: () => import('../views/production/production-execution/Schedule.vue'),
        meta: { layout: 'ProductionLayout', title: `Lịch sản xuất | ${appName}` }
    },
    {
        path: '/production/production-execution/material-request',
        component: () => import('../views/production/production-execution/MaterialRequest.vue'),
        meta: { layout: 'ProductionLayout', title: `Yêu cầu xuất vật tư | ${appName}` }
    },
    {
        path: '/production/production-execution/statistics',
        component: () => import('../views/production/production-execution/Statistics.vue'),
        meta: { layout: 'ProductionLayout', title: `Phiếu thống kê sản xuất | ${appName}` }
    },
    {
        path: '/production/production-execution/product-request',
        component: () => import('../views/production/production-execution/ProductRequest.vue'),
        meta: { layout: 'ProductionLayout', title: `Yêu cầu nhập thành phẩm, nguyên vật liệu thừa | ${appName}` }
    },
    {
        path: '/production/production-execution/handover',
        component: () => import('../views/production/production-execution/Handover.vue'),
        meta: { layout: 'ProductionLayout', title: `Phiếu bàn giao | ${appName}` }
    },
    {
        path: '/production/production-execution/handoverreturn',
        component: () => import('../views/production/production-execution/HandoverReturn.vue'),
        meta: { layout: 'ProductionLayout', title: `Phiếu trả lại | ${appName}` }
    },
    {
        path: '/production/production-execution/handover-overview',
        component: () => import('../views/production/production-execution/HandoverOverview.vue'),
        meta: { layout: 'ProductionLayout', title: `Tình hình bàn giao sản xuất | ${appName}` }
    },

    //product-quality/criteria
    {
        path: '/production/product-quality/criteria',
        component: () => import('../views/production/product-quality/Criteria.vue'),
        meta: { layout: 'ProductionLayout', title: `Tiêu chí chất lượng | ${appName}` }
    },
    {
        path: '/production/product-quality/quality-check-request',
        component: () => import('../views/production/product-quality/QualityCheckRequest.vue'),
        meta: { layout: 'ProductionLayout', title: `Yêu cầu kiểm tra chất lượng | ${appName}` }
    },
    {
        path: '/production/product-quality/inspection-voucher',
        component: () => import('../views/production/product-quality/InspectionVoucher.vue'),
        meta: { layout: 'ProductionLayout', title: `Phiếu kiểm tra | ${appName}` }
    },
    {
        path: '/production/product-quality/criteria-group',
        component: () => import('../views/production/product-quality/CriteriaGroup.vue'),
        meta: { layout: 'ProductionLayout', title: `Nhóm tiêu chí chất lượng | ${appName}` }
    },
    {
        path: '/production/product-quality/sampling-method',
        component: () => import('../views/production/product-quality/SamplingMethod.vue'),
        meta: { layout: 'ProductionLayout', title: `Phương pháp chọn mẫu | ${appName}` }
    },
    {
        path: '/production/product-quality/quality-standard',
        component: () => import('../views/production/product-quality/QualityStandard.vue'),
        meta: { layout: 'ProductionLayout', title: `Bộ tiêu chuẩn kiểm tra chất lượng | ${appName}` }
    },
    {
        path: '/production/product-quality/quality-error',
        component: () => import('../views/production/product-quality/QualityError.vue'),
        meta: { layout: 'ProductionLayout', title: `Lỗi kiểm tra chất lượng | ${appName}` }
    },
    {
        path: '/production/product-quality/quality-error-group',
        component: () => import('../views/production/product-quality/QualityErrorGroup.vue'),
        meta: { layout: 'ProductionLayout', title: `Nhóm lỗi kiểm tra chất lượng | ${appName}` }
    },

    //production-material
    {
        path: '/production/production-material/request-material',
        component: () => import('../views/production/production-material/RequestMaterial.vue'),
        meta: { layout: 'ProductionLayout', title: `Đề nghị kho cấp vật tư | ${appName}` }
    },
    {
        path: '/production/production-material/export-material',
        component: () => import('../views/production/production-material/ExportMaterial.vue'),
        meta: { layout: 'ProductionLayout', title: `Phiếu xuất kho tại nhà máy | ${appName}` }
    },
    {
        path: '/production/production-material/factory-inward',
        component: () => import('../views/production/production-material/FactoryInward.vue'),
        meta: { layout: 'ProductionLayout', title: `Phiếu nhập kho tại nhà máy | ${appName}` }
    },
    {
        path: '/production/production-material/opn-inventory-stock',
        component: () => import('../views/production/production-material/OpenInventoryStock.vue'),
        meta: { layout: 'ProductionLayout', title: `Tồn kho đầu kỳ tại nhà máy | ${appName}` }
    },
    {
        path: '/production/production-material/transfer-material',
        component: () => import('../views/production/production-material/TransferMaterial.vue'),
        meta: { layout: 'ProductionLayout', title: `Điều chuyển vật tư | ${appName}` }
    },

    //dictionary
    {
        path: '/production/dictionary/inventoryitem',
        component: () => import('../views/production/dictionary/InventoryItem.vue'),
        meta: { layout: 'ProductionLayout', title: `Vật tư hàng hóa | ${appName}` }
    },
    {
        path: '/production/dictionary/inventoryitemgroup',
        component: () => import('../views/production/dictionary/InventoryItemGroup.vue'),
        meta: { layout: 'ProductionLayout', title: `Nhóm vật tư hàng hóa | ${appName}` }
    },
    {
        path: '/production/dictionary/billOfMaterials',
        component: () => import('../views/production/dictionary/BillOfMaterials.vue'),
        meta: { layout: 'ProductionLayout', title: `Định mức nguyên vật liệu (BOM) | ${appName}` }
    },
    {
        path: '/production/dictionary/billOfDisassembly',
        component: () => import('../views/production/dictionary/BillOfDisassembly.vue'),
        meta: { layout: 'ProductionLayout', title: `Định mức tháo dỡ | ${appName}` }
    },
    {
        path: '/production/dictionary/alternativeMaterialList',
        component: () => import('../views/production/dictionary/AlternativeMaterialList.vue'),
        meta: { layout: 'ProductionLayout', title: `Nguyên vật liệu thay thế | ${appName}` }
    },

    //production-process
    {
        path: '/production/production-process/stage',
        component: () => import('../views/production/production-process/Stage.vue'),
        meta: { layout: 'ProductionLayout', title: `Công đoạn | ${appName}` }
    },
    {
        path: '/production/production-process/production-process',
        component: () => import('../views/production/production-process/ProductionProcess.vue'),
        meta: { layout: 'ProductionLayout', title: `Quy trình | ${appName}` }
    },

    //production-capacity
    {
        path: '/production/production-capacity/productionTeam',
        component: () => import('../views/production/production-capacity/ProductionTeam.vue'),
        meta: { layout: 'ProductionLayout', title: `Tổ sản xuất | ${appName}` }
    },
    {
        path: '/production/production-capacity/productionEquipment',
        component: () => import('../views/production/production-capacity/ProductionEquipment.vue'),
        meta: { layout: 'ProductionLayout', title: `Máy móc | ${appName}` }
    },
    {
        path: '/production/production-capacity/productionCapacityGroup',
        component: () => import('../views/production/production-capacity/ProductionCapacityGroup.vue'),
        meta: { layout: 'ProductionLayout', title: `Nhóm năng lực | ${appName}` }
    },
    {
        path: '/production/production-capacity/productionPattern',
        component: () => import('../views/production/production-capacity/ProductionPattern.vue'),
        meta: { layout: 'ProductionLayout', title: `Khuôn | ${appName}` }
    },


    //Other categories
    {
        path: '/production/other-categories/currency',
        component: () => import('../views/production/other-categories/Currency.vue'),
        meta: { layout: 'ProductionLayout', title: `Đơn vị tiền tệ | ${appName}` }
    },
    {
        path: '/production/other-categories/customer',
        component: () => import('../views/production/other-categories/Customer.vue'),
        meta: { layout: 'ProductionLayout', title: `Khách hàng | ${appName}` }
    },
    {
        path: '/production/other-categories/employee',
        component: () => import('../views/production/other-categories/Employee.vue'),
        meta: { layout: 'ProductionLayout', title: `Nhân viên | ${appName}` }
    },
    {
        path: '/production/other-categories/holiday-schedule',
        component: () => import('../views/production/other-categories/HolidaySchedule.vue'),
        meta: { layout: 'ProductionLayout', title: `Ngày nghỉ | ${appName}` }
    },
    {
        path: '/production/other-categories/job',
        component: () => import('../views/production/other-categories/Job.vue'),
        meta: { layout: 'ProductionLayout', title: `Đối tượng tập hợp chi phí | ${appName}` }
    },
    {
        path: '/production/other-categories/organization',
        component: () => import('../views/production/other-categories/Organization.vue'),
        meta: { layout: 'ProductionLayout', title: `Cơ cấu tổ chức | ${appName}` }
    },
    {
        path: '/production/other-categories/reason',
        component: () => import('../views/production/other-categories/Reason.vue'),
        meta: { layout: 'ProductionLayout', title: `Lý do dừng công việc | ${appName}` }
    },
    {
        path: '/production/other-categories/shift',
        component: () => import('../views/production/other-categories/shift/ShiftList.vue'),
        meta: { layout: 'ProductionLayout', title: `Ca làm việc | ${appName}` }
    },
    {
        path: '/production/other-categories/stock',
        component: () => import('../views/production/other-categories/Stock.vue'),
        meta: { layout: 'ProductionLayout', title: `Kho | ${appName}` }
    },
    {
        path: '/production/other-categories/supplier',
        component: () => import('../views/production/other-categories/Supplier.vue'),
        meta: { layout: 'ProductionLayout', title: `Nhà cung cấp | ${appName}` }
    },
    {
        path: '/production/other-categories/unit',
        component: () => import('../views/production/other-categories/Unit.vue'),
        meta: { layout: 'ProductionLayout', title: `Đơn vị tính | ${appName}` }
    },
    {
        path: '/production/other-categories/work-schedule',
        component: () => import('../views/production/other-categories/WorkSchedule.vue'),
        meta: { layout: 'ProductionLayout', title: `Lịch làm việc | ${appName}` }
    },

    //Report list
    {
        path: '/production/reportlist',
        component: () => import('../views/production/ReportList.vue'),
        meta: { layout: 'ProductionLayout', title: `Báo cáo | ${appName}` }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Thêm đoạn code này để đổi tên tab động
router.beforeEach((to, from, next) => {
    // Lấy tiêu đề từ thuộc tính meta của route đích
    // Nếu route đó không có meta.title, nó sẽ sử dụng biến appName hoặc tên mặc định
    const defaultTitle = appName || 'Ứng dụng Quản lý';
    (document as any).title = to.meta.title || defaultTitle;

    // Tiếp tục quá trình chuyển trang
    next();
});

export default router