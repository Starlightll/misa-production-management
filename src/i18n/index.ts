import { createI18n } from 'vue-i18n'

const messages = {
    vi: {
        sidebar: {
            overview: 'Tổng quan',
            saleOrder: 'Đơn đặt hàng',
            productionPlan: 'Kế hoạch sản xuất',
            plan: {
                saleOrderPlan: 'Kế hoạch theo đơn hàng',
                overallPlan: 'Kế hoạch tổng thể',
                detailPlan: 'Kế hoạch chi tiết',
                materialPlan: 'Kế hoạch nguyên vật liệu',
                materialPurchaseRequest: 'Yêu cầu mua NVL',
                purchaseOrder: 'Đơn mua hàng'
            },
            productionExecution: 'Điều phối và thực thi',
            execution: {
                order: 'Lệnh sản xuất',
                dismantleOrder: 'Lệnh tháo gỡ',
                schedule: 'Lịch sản xuất',
                materialRequest: 'Yêu cầu xuất vật tư',
                statistics: 'Thống kê sản xuất',
                productRequest: 'Yêu cầu nhập thành phầm, nguyên vật liệu thừa',
                handover: 'Bàn giao',
                handoverReturn: 'Trả lại',
                handoverOverview: 'Tình hình bàn giao sản xuất'
            },
            productQuality: 'Kiểm tra chất lượng',
            productQualityItems: {
                qualityCheckRequest: 'Yêu cầu kiểm tra',
                inspectionVoucher: 'Phiếu kiểm tra',
                criteria: 'Tiêu chí chất lượng',
                criteriaGroup: 'Nhóm tiêu chí chất lượng',
                samplingMethod: 'Phương pháp chọn mẫu',
                qualityStandard: 'Bộ tiêu chuẩn kiểm tra chất lượng',
                qualityError: 'Lỗi kiểm tra chất lượng',
                qualityErrorGroup: 'Nhóm lỗi kiểm tra chất lượng'
            },
            productionMaterial: 'Kho vật tư',
            productionMaterialItems: {
                requestMaterial: 'Đề nghị kho cấp vật tư',
                factoryInward: 'Nhập kho',
                exportMaterial: 'Xuất kho',
                transferMaterial: 'Điều chuyển',
                opnInventoryStock: 'Tồn kho đầu kỳ'
            },
            dictionary: 'Sản phẩm, NVL',
            dictionaryItems: {
                inventoryItem: 'Vật tư hàng hóa',
                inventoryItemGroup: 'Nhóm vật tư hàng hóa',
                billOfMaterials: 'Định mức nguyên vật liệu',
                billOfDisassembly: 'Định mức tháo dỡ',
                alternativeMaterialList: 'Nguyên vật liệu thay thế',
            },
            productionProcess: 'Quy trình',
            productionProcessItems: {
                stage: 'Công đoạn',
                productionProcess: 'Quy trình',
            },
            productionCapacity: 'Năng lực sản xuất',
            productionCapacityItems: {
                productionTeam: 'Tổ sản xuất',
                productionEquipment: 'Máy móc',
                productionCapacityGroup: 'Nhóm năng lực',
                productionPattern: 'Khuôn'
            },
            otherCategories: 'Danh mục khác',
            otherCategoriesItems: {
                customer: 'Khách hàng',
                supplier: 'Nhà cung cấp',
                employee: 'Nhân viên',
                job: 'Đối tượng tập hợp chi phí',
                shift: 'Ca làm việc',
                holidaySchedule: 'Ngày nghỉ',
                workSchedule: 'Lịch làm việc',
                organization: 'Cơ cấu tổ chức',
                stock: 'Kho',
                unit: 'Đơn vị tính',
                reason: 'Lý do dừng công việc',
                currency: 'Loại tiền'
            },
            panel: {
                objects: 'Đối tượng',
                workSchedule: 'Lịch làm việc',
                others: 'Khác'
            },
            objects: 'Đối tượng',
            others: 'Khác',
            work: {
                shift: 'Ca làm việc',
                holidaySchedule: 'Ngày nghỉ',
                workSchedule: 'Lịch làm việc'
            },
            othersList: {
                organization: 'Cơ cấu tổ chức',
                stock: 'Kho',
                unit: 'Đơn vị tính',
                reason: 'Lý do dừng công việc',
                currency: 'Loại tiền'
            },
            reports: 'Báo cáo',
            collapse: 'Thu gọn',
            expand: 'Mở rộng'
        },
        shift: {
            shiftTitle: 'Ca làm việc',
            shiftCode: 'Mã ca',
            shiftName: 'Tên ca',
            shiftBeginTime: 'Giờ vào ca',
            shiftEndTime: 'Giờ hết ca',
            shiftBeginBreakTime: 'Bắt đầu nghỉ giữa ca',
            shiftEndBreakTime: 'Kết thúc nghỉ giữa ca',
            shiftWorkingTime: 'Thời gian làm việc (giờ)',
            shiftBreakingTime: 'Thời gian nghỉ giữa ca (giờ)',
            status: 'Trạng thái',
            createdBy: 'Người tạo',
            createdDate: 'Ngày tạo',
            modifiedBy: 'Người sửa',
            modifiedDate: 'Ngày sửa',
            shiftDescription: 'Mô tả',
            action: 'Hành động',
            rowAndPage: 'Số dòng/trang',
            total: 'Tổng số',
            add: 'Thêm',
            edit: 'Sửa',
            save: 'Lưu',
            saveAndAdd: 'Lưu và thêm',
            cancel: 'Hủy',
            delete: 'Xóa',
            shiftActive: 'Đang hoạt động',
            shiftInactive: 'Ngừng hoạt động',
            search: 'Tìm kiếm',
        }
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'vi',
    fallbackLocale: 'vi',
    globalInjection: true,
    messages
})

export default i18n
