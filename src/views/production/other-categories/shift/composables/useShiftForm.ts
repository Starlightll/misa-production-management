import { ref, computed } from 'vue';
import type { Shift } from '../../../../../types/Shift';

export function useShiftForm() {
    const formShiftData = ref({
        shiftId: '',
        shiftCode: '',
        shiftName: '',
        shiftDescription: '',
        shiftBeginTime: '' as string | null,
        shiftEndTime: '' as string | null,
        shiftBeginBreakTime: '' as string | null,
        shiftEndBreakTime: '' as string | null,
        shiftWorkingTime: 0.0000,
        shiftBreakingTime: 0.0000,
        shiftInactive: false,
        createdBy: '',
        modifiedBy: '',
    });


    const formShiftBeforeEditData = ref({
        shiftId: '',
        shiftCode: '',
        shiftName: '',
        shiftDescription: '',
        shiftBeginTime: '' as string | null,
        shiftEndTime: '' as string | null,
        shiftBeginBreakTime: '' as string | null,
        shiftEndBreakTime: '' as string | null,
        shiftWorkingTime: 0.0000,
        shiftBreakingTime: 0.0000,
        shiftInactive: false,
        createdBy: '',
        modifiedBy: '',
    });

    const formShiftError = ref({
        shiftCode: '',
        shiftName: '',
        shiftBeginTime: '',
        shiftEndTime: '',
        shiftBeginBreakTime: '',
        shiftEndBreakTime: '',
        shiftWorkingTime: '',
        shiftBreakingTime: '',
    });

    const resetFormShiftError = () => {
        formShiftError.value = {
            shiftCode: '',
            shiftName: '',
            shiftBeginTime: '',
            shiftEndTime: '',
            shiftBeginBreakTime: '',
            shiftEndBreakTime: '',
            shiftWorkingTime: '',
            shiftBreakingTime: '',
        };
    };


    const resetFormShiftData = () => {
        formShiftData.value = {
            shiftId: '',
            shiftCode: '',
            shiftName: '',
            shiftDescription: '',
            shiftBeginTime: '' as string | null,
            shiftEndTime: '' as string | null,
            shiftBeginBreakTime: '' as string | null,
            shiftEndBreakTime: '' as string | null,
            shiftWorkingTime: 0,
            shiftBreakingTime: 0,
            shiftInactive: false,
            createdBy: '',
            modifiedBy: '',
        };
    };

    const validateShiftForm = () => {
        const isValidCode = validateShiftCode(formShiftData.value.shiftCode);
        const isValidName = validateShiftName(formShiftData.value.shiftName);
        const isValidBeginTime = validateShiftBeginTime(formShiftData.value.shiftBeginTime);
        const isValidEndTime = validateShiftEndTime(formShiftData.value.shiftEndTime);
        const isValidBeginBreakTime = validateShiftBeginBreakTime(formShiftData.value.shiftBeginBreakTime);
        const isValidEndBreakTime = validateShiftEndBreakTime(formShiftData.value.shiftEndBreakTime);

        return isValidCode && isValidName && isValidBeginTime && isValidEndTime && isValidBeginBreakTime && isValidEndBreakTime;
    };

    const validateShiftCode = (code: string) => {
        if (!code) {
            formShiftError.value.shiftCode = 'Mã ca không được để trống';
            return false;
        } else if (code.length > 20) {
            formShiftError.value.shiftCode = 'Mã ca không được vượt quá 20 ký tự';
            return false;
        }
        formShiftError.value.shiftCode = '';
        return true;
    };
    const validateShiftName = (name: string) => {
        if (!name) {
            formShiftError.value.shiftName = 'Tên ca không được để trống';
            return false;
        } else if (name.length > 50) {
            formShiftError.value.shiftName = 'Tên ca không được vượt quá 50 ký tự';
            return false;
        }
        formShiftError.value.shiftName = '';
        return true;
    };

    const validateShiftBeginTime = (time: string | null) => {
        if (!time) {
            formShiftError.value.shiftBeginTime = 'Giờ vào ca không được để trống';
            return false;
        }
        const beginTime = formShiftData.value.shiftBeginTime;
        const endTime = formShiftData.value.shiftEndTime;
        if (beginTime === endTime) {
            formShiftError.value.shiftBeginTime = 'Giờ hết ca không được bằng giờ vào ca.';
            return false;
        }
        formShiftError.value.shiftBeginTime = '';
        return true;
    };

    const validateShiftEndTime = (time: string | null) => {
        if (!time) {
            formShiftError.value.shiftEndTime = 'Giờ hết ca không được để trống';
            return false;
        }
        const beginTime = formShiftData.value.shiftBeginTime;
        const endTime = formShiftData.value.shiftEndTime;
        if (beginTime === endTime) {
            formShiftError.value.shiftEndTime = 'Giờ hết ca không được bằng giờ vào ca.';
            return false;
        }
        formShiftError.value.shiftEndTime = '';
        return true;
    };

    const validateShiftBeginBreakTime = (time: string | null) => {
        if (!time && formShiftData.value.shiftEndBreakTime) {
            formShiftError.value.shiftBeginBreakTime = 'Bắt đầu nghỉ giữa ca không được để trống khi đã có Kết thúc nghỉ giữa ca.';
            return false;
        }

        if (time && formShiftData.value.shiftEndTime && formShiftData.value.shiftBeginTime) {
            const beginTime = new Date(`2000-01-01T${formShiftData.value.shiftBeginTime}:00`);
            const endTime = new Date(`2000-01-01T${formShiftData.value.shiftEndTime}:00`);

            // Xử lý ca qua đêm
            if (endTime <= beginTime) {
                endTime.setDate(endTime.getDate() + 1);
            }

            // Hàm phụ trợ đồng bộ ngày: Nếu ca qua đêm và giờ nhập vào < giờ bắt đầu -> nó là của ngày hôm sau
            const getAdjustedTime = (timeStr: string) => {
                const timeDate = new Date(`2000-01-01T${timeStr}:00`);
                if (endTime.getDate() === 2 && timeDate < beginTime) {
                    timeDate.setDate(timeDate.getDate() + 1);
                }
                return timeDate;
            };

            const beginBreakTime = getAdjustedTime(time);

            // 1. Kiểm tra giờ bắt đầu nghỉ có nằm trong khoảng ca làm việc không
            if (beginBreakTime < beginTime || beginBreakTime > endTime) {
                formShiftError.value.shiftBeginBreakTime = 'Thời gian bắt đầu nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.';
                return false;
            }

            // 2. Nếu có giờ kết thúc nghỉ, check logic chéo
            if (formShiftData.value.shiftEndBreakTime) {
                const endBreakTime = getAdjustedTime(formShiftData.value.shiftEndBreakTime);

                if (beginBreakTime.getTime() === endBreakTime.getTime()) {
                    formShiftError.value.shiftBeginBreakTime = 'Bắt đầu nghỉ giữa ca không được bằng Kết thúc nghỉ giữa ca.';
                    return false;
                }

                if (beginBreakTime > endBreakTime) {
                    formShiftError.value.shiftBeginBreakTime = 'Bắt đầu nghỉ giữa ca không được lớn hơn Kết thúc nghỉ giữa ca.';
                    return false;
                }
            }
        }
        formShiftError.value.shiftBeginBreakTime = '';
        return true;
    };

    const validateShiftEndBreakTime = (time: string | null) => {
        if (!time && formShiftData.value.shiftBeginBreakTime) {
            formShiftError.value.shiftEndBreakTime = 'Kết thúc nghỉ giữa ca không được để trống khi đã có Bắt đầu nghỉ giữa ca.';
            return false;
        }

        if (time && formShiftData.value.shiftEndTime && formShiftData.value.shiftBeginTime) {
            const beginTime = new Date(`2000-01-01T${formShiftData.value.shiftBeginTime}:00`);
            const endTime = new Date(`2000-01-01T${formShiftData.value.shiftEndTime}:00`);

            if (endTime <= beginTime) {
                endTime.setDate(endTime.getDate() + 1);
            }

            const getAdjustedTime = (timeStr: string) => {
                const timeDate = new Date(`2000-01-01T${timeStr}:00`);
                if (endTime.getDate() === 2 && timeDate < beginTime) {
                    timeDate.setDate(timeDate.getDate() + 1);
                }
                return timeDate;
            };

            const endBreakTime = getAdjustedTime(time);

            if (endBreakTime < beginTime || endBreakTime > endTime) {
                formShiftError.value.shiftEndBreakTime = 'Thời gian kết thúc nghỉ giữa ca phải nằm trong khoảng thời gian tính từ giờ vào ca đến giờ hết ca. Vui lòng kiểm tra lại.';
                return false;
            }

            if (formShiftData.value.shiftBeginBreakTime) {
                const beginBreakTime = getAdjustedTime(formShiftData.value.shiftBeginBreakTime);

                if (endBreakTime.getTime() === beginBreakTime.getTime()) {
                    formShiftError.value.shiftEndBreakTime = 'Kết thúc nghỉ giữa ca không được bằng Bắt đầu nghỉ giữa ca.';
                    return false;
                }

                if (beginBreakTime > endBreakTime) {
                    formShiftError.value.shiftEndBreakTime = 'Kết thúc nghỉ giữa ca không được nhỏ hơn Bắt đầu nghỉ giữa ca.';
                    return false;
                }
            }
        }
        formShiftError.value.shiftEndBreakTime = '';
        return true;
    };


    //#region calculate shift working time and breaking time
    const shiftWorkingTime = ref('');
    const shiftBreakingTime = ref('');
    const calculateShiftTimes = () => {
        let timeWorking = 0;
        let timeBreaking = 0;
        if (formShiftData.value.shiftBeginTime && formShiftData.value.shiftEndTime) {
            const begin = new Date(`1970-01-01T${formShiftData.value.shiftBeginTime}`);
            const end = new Date(`1970-01-01T${formShiftData.value.shiftEndTime}`);
            if (end < begin) {
                // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu, cộng thêm 1 ngày vào giờ kết thúc để tính toán đúng
                end.setDate(end.getDate() + 1);
            }
            let workingTime = (end.getTime() - begin.getTime()) / (1000 * 60 * 60);
            if (workingTime < 0) {
                workingTime += 24; // Handle overnight shifts
            }
            timeWorking = workingTime;
        } else {
            timeWorking = 0;
        }

        if (formShiftData.value.shiftBeginBreakTime && formShiftData.value.shiftEndBreakTime) {
            const breakBegin = new Date(`1970-01-01T${formShiftData.value.shiftBeginBreakTime}`);
            const breakEnd = new Date(`1970-01-01T${formShiftData.value.shiftEndBreakTime}`);
            if (breakEnd < breakBegin) {
                // Nếu giờ kết thúc nghỉ nhỏ hơn giờ bắt đầu nghỉ, cộng thêm 1 ngày vào giờ kết thúc nghỉ để tính toán đúng
                breakEnd.setDate(breakEnd.getDate() + 1);
            }
            let breakingTime = (breakEnd.getTime() - breakBegin.getTime()) / (1000 * 60 * 60);
            if (breakingTime < 0) {
                breakingTime += 24; // Handle overnight breaks
            }
            timeBreaking = breakingTime;
        } else {
            timeBreaking = 0;
        }
        timeWorking = timeWorking - timeBreaking; // Trừ thời gian nghỉ giữa ca ra khỏi thời gian làm việc
        if (timeWorking < 0) {
            shiftWorkingTime.value = `(${Math.abs(timeWorking).toFixed(3)})`; // Hiển thị thời gian làm việc âm trong trường hợp thời gian nghỉ giữa ca lớn hơn thời gian làm việc
        } else {
            shiftWorkingTime.value = timeWorking.toFixed(3);
        }
        if (timeBreaking < 0) {
            shiftBreakingTime.value = `(${Math.abs(timeBreaking).toFixed(3)})`; // Hiển thị thời gian nghỉ giữa ca âm trong trường hợp giờ kết thúc nghỉ nhỏ hơn giờ bắt đầu nghỉ
        } else {
            shiftBreakingTime.value = timeBreaking.toFixed(3);
        }
    };

    //#endregion

    const convertToTimeString = (time: string | null) => {
        if (!time) return null;
        if (time.length === 5) {
            return time + ':00';
        }
        return time;
    };



    return {
        formShiftData,
        formShiftBeforeEditData,
        formShiftError,
        shiftWorkingTime,
        shiftBreakingTime,
        validateShiftCode,
        validateShiftName,
        validateShiftBeginTime,
        validateShiftEndTime,
        validateShiftBeginBreakTime,
        validateShiftEndBreakTime,
        calculateShiftTimes,
        validateShiftForm,
        resetFormShiftError,
        resetFormShiftData,
        convertToTimeString
    };

}