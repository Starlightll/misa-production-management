<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useShiftForm } from '../composables/useShiftForm';
import { shiftService } from '../../../../../api/shiftService';
import { useAuthStore } from '../../../../../stores/auth';
import { useMessage } from '../../../../../composables/useMessage';
import type { isLeftHandSideExpression } from 'typescript';

const message = useMessage();

const authStore = useAuthStore();
const {
    formShiftData, formShiftBeforeEditData, formShiftError, shiftWorkingTime, shiftBreakingTime,
    validateShiftCode, validateShiftName, validateShiftBeginTime, validateShiftEndTime,
    validateShiftBeginBreakTime, validateShiftEndBreakTime, calculateShiftTimes,
    validateShiftForm, resetFormShiftError, resetFormShiftData, convertToTimeString
} = useShiftForm();

const emit = defineEmits<{
    (e: 'saved', response: any): void; // Chỉ giữ lại emit saved, không cần emit close nữa
}>();

const isVisible = ref(false);
const currentState = ref<'add' | 'edit' | 'duplicate'>('add');
const currentShiftId = ref<string>('');

// showModal từ component cha sẽ gọi vào function này để mở modal và reset dữ liệu
const showModal = async (state: 'add' | 'edit' | 'duplicate', shiftId: string = '', originalData?: any) => {
    // 1. Cập nhật state nội bộ & mở modal
    currentState.value = state;
    currentShiftId.value = shiftId;
    isVisible.value = true;

    // 2. Reset dữ liệu cũ
    resetFormShiftError();
    resetFormShiftData();

    // 3. Xử lý logic Thêm/Sửa
    if (state === 'edit' && shiftId) {
        try {
            const response = await shiftService.getById(shiftId);
            if (response && response.data) {
                formShiftData.value = response.data;
                formShiftData.value.modifiedBy = authStore.currentUser.name;
                calculateShiftTimes();
            }
        } catch (error) {
            handleClose(); // Lỗi thì đóng modal luôn
        }

    }
    else if (state === 'duplicate' && originalData) {
        formShiftData.value = { ...originalData, shiftCode: '' }; // Reset code & name khi duplicate
        formShiftData.value.createdBy = authStore.currentUser.name;
        formShiftData.value.modifiedBy = authStore.currentUser.name;
        calculateShiftTimes();
    }
    else {
        formShiftData.value.createdBy = authStore.currentUser.name;
    }
    shiftCodeInput.value?.$el.querySelector('input')?.focus();
    formShiftBeforeEditData.value = { ...formShiftData.value }; // Lưu lại dữ liệu ban đầu để so sánh khi check unsaved changes
};

const unSavedChanges = computed(() => {
    const isDataChanged = JSON.stringify(formShiftData.value) !== JSON.stringify(formShiftBeforeEditData.value);
    return isDataChanged;
});

const handleClose = (checkUnsaved = true) => {
    if (checkUnsaved && unSavedChanges.value) {
        message.show({
            title: "Thoát và không lưu?",
            variant: "info",
            acceptText: "Đồng ý",
            message: 'Nếu bạn thoát, các dữ liệu đang nhập liệu sẽ không được lưu lại.',
            onAccept: async () => {
                isVisible.value = false;
                setTimeout(() => {
                    resetFormShiftError();
                    resetFormShiftData();
                }, 300);
            },
        });
    } else {
        isVisible.value = false;
        setTimeout(() => {
            resetFormShiftError();
            resetFormShiftData();
        }, 300);
    }
};

const shiftCodeInput = ref<any>(null);
const shiftNameInput = ref<any>(null);
const shiftBeginTimeInput = ref<any>(null);
const shiftEndTimeInput = ref<any>(null);
const shiftBeginBreakTimeInput = ref<any>(null);
const shiftEndBreakTimeInput = ref<any>(null);

const handleSave = async (addAnother = false) => {
    console.log('Form data before save:', formShiftData.value);
    let saveMessage = '';
    if (!validateShiftForm()) {
        console.log('Validation failed:', formShiftError.value);
        let focusField = () => { }
        if (formShiftError.value.shiftCode) {
            // Show modal error message
            focusField = () => {
                shiftCodeInput.value?.$el.querySelector('input')?.focus();
            };
            saveMessage = formShiftError.value.shiftCode;
        }
        else if (formShiftError.value.shiftName) {
            focusField = () => {
                shiftNameInput.value?.$el.querySelector('input')?.focus();
            };
            saveMessage = formShiftError.value.shiftName;
        }
        else if (formShiftError.value.shiftBeginTime) {
            focusField = () => {
                shiftBeginTimeInput.value?.$el.querySelector('input')?.focus();
            };
            saveMessage = formShiftError.value.shiftBeginTime;
        }
        else if (formShiftError.value.shiftEndTime) {
            focusField = () => {
                shiftEndTimeInput.value?.$el.querySelector('input')?.focus();
            };
            saveMessage = formShiftError.value.shiftEndTime;
        }
        else if (formShiftError.value.shiftBeginBreakTime) {
            focusField = () => {
                shiftBeginBreakTimeInput.value?.$el.querySelector('input')?.focus();
            };
            saveMessage = formShiftError.value.shiftBeginBreakTime;
        }
        else if (formShiftError.value.shiftEndBreakTime) {
            focusField = () => {
                shiftEndBreakTimeInput.value?.$el.querySelector('input')?.focus();
            };
            saveMessage = formShiftError.value.shiftEndBreakTime;
        }

        message.show({
            title: "Cảnh báo",
            variant: "warning",
            acceptText: "Đồng ý",
            type: "message",
            message: saveMessage,
            onAccept: async () => {
                focusField();
            },
            onCancel: async () => {
                focusField();
            }
        });
        return;
    }


    // Convert time fields to HH:mm:ss format if they are not already
    formShiftData.value.shiftBeginTime = convertToTimeString(formShiftData.value.shiftBeginTime);
    formShiftData.value.shiftEndTime = convertToTimeString(formShiftData.value.shiftEndTime);
    formShiftData.value.shiftBeginBreakTime = convertToTimeString(formShiftData.value.shiftBeginBreakTime);
    formShiftData.value.shiftEndBreakTime = convertToTimeString(formShiftData.value.shiftEndBreakTime);
    formShiftData.value.shiftWorkingTime = Number(shiftWorkingTime.value);
    formShiftData.value.shiftBreakingTime = Number(shiftBreakingTime.value);

    let response = null;

    try {
        if (currentState.value === 'edit' && currentShiftId.value) {
            formShiftData.value.modifiedBy = authStore.currentUser.name;
            response = await shiftService.update(currentShiftId.value, formShiftData.value as any);
        } else {
            formShiftData.value.createdBy = authStore.currentUser.name;
            formShiftData.value.modifiedBy = authStore.currentUser.name;
            response = await shiftService.create(formShiftData.value as any);
        }

        emit('saved', response); // Emit sự kiện saved với dữ liệu mới
        if (addAnother) {
            showModal('add');
        } else {
            isVisible.value = false; // Tự đóng nội bộ
        }
    } catch (error: any) {
        const response = error.response;
        console.log('Validation error response:', response.data.ErrorCode);
        if (response && response.data && response.data.ErrorCode === 'MISA_VALIDATE_FAIL') {
            console.log('Validation error response:', response.data);
            const errorDetails = response.data.Details;
            let focusField: () => void = () => { };
            let messageText = '';
            errorDetails.forEach((detail: any) => {
                const detailFieldLowerCase = detail.Field.toLowerCase();
                //Compare ignore case
                if (detailFieldLowerCase === 'shiftcode') {
                    if (detail.Code === 'MISA_DUPLICATE_FIELD') {
                        formShiftError.value.shiftCode = detail.message;
                        messageText = /*html*/ `Ca làm việc <b>${'<' + formShiftData.value.shiftCode + '>'}</b> đã tồn tại. Vui lòng kiểm tra lại.`;
                    }
                    focusField = () => {
                        shiftCodeInput.value?.$el.querySelector('input')?.focus();
                    };
                }
                else if (detailFieldLowerCase === 'shiftname') {
                    focusField = () => {
                        shiftNameInput.value?.$el.querySelector('input')?.focus();
                    };
                    formShiftError.value.shiftName = detail.message;
                }
                else if (detailFieldLowerCase === 'shiftbegintime') {
                    focusField = () => {
                        shiftBeginTimeInput.value?.$el.querySelector('input')?.focus();
                    };
                    formShiftError.value.shiftBeginTime = detail.message;
                }
                else if (detailFieldLowerCase === 'shiftendtime') {
                    focusField = () => {
                        shiftEndTimeInput.value?.$el.querySelector('input')?.focus();
                    };
                    formShiftError.value.shiftEndTime = detail.message;
                }
                else if (detailFieldLowerCase === 'shiftbeginbreaktime') {
                    focusField = () => {
                        shiftBeginBreakTimeInput.value?.$el.querySelector('input')?.focus();
                    };
                    formShiftError.value.shiftBeginBreakTime = detail.message;
                }
                else if (detailFieldLowerCase === 'shiftendbreaktime') {
                    focusField = () => {
                        shiftEndBreakTimeInput.value?.$el.querySelector('input')?.focus();
                    };
                    formShiftError.value.shiftEndBreakTime = detail.message;
                }
            });
            message.show({
                icon: 'mi-qtsx icon-danger bg-(--color-danger)!',
                title: "Cảnh báo!",
                acceptText: "Đóng",
                type: "message",
                message: messageText || 'Có lỗi xảy ra khi lưu ca làm việc. Vui lòng kiểm tra lại.',
                onAccept: async () => {
                    focusField();
                },
                onCancel: async () => {
                    focusField();
                }
            });
        } else {
            message.show({
                icon: 'mi-qtsx icon-danger bg-(--color-danger)!',
                title: "Cảnh báo!",
                acceptText: "Đóng",
                type: "message",
                message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
            });
        }
    }
};


const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (!isVisible.value) return;
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (isCtrlOrCmd && key === 's') {
        e.preventDefault();

        if (e.shiftKey) {
            handleSave(true);
        } else {
            handleSave();
        }
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboardShortcuts);
});

// Expose để cha có thể gọi được
defineExpose({
    showModal
});

</script>
<template lang="html">
    <!-- Add/Edit shift Modal -->
    <MsModal :title="'ABC'" :visible="isVisible" width="680px" height="auto" @close="handleClose">
        <template #header>
            <div class="form__popup__header__title">
                <div class="form__popup__header__title__text">
                    {{ currentState === 'edit' && currentShiftId ? 'Sửa ca làm việc' : 'Thêm ca làm việc' }}
                </div>
            </div>
            <div class="flex gap-2">
                <div class="mi-warehouse icon20 ic-help cursor-pointer" @click="" v-tooltip.top="'Trợ giúp'">
                </div>
                <div class="mi-warehouse icon20 close cursor-pointer" @click="handleClose()" v-tooltip.top="'Đóng'">
                </div>
            </div>

        </template>
        <template #body>
            <div class="w-full flex gap-4 items-center mb-[16px]">
                <label class="w-[150px]">
                    Mã ca <span class="text-red-500">*</span>
                </label>
                <div class="flex-1">
                    <MsInput placeholder="Nhập mã ca làm việc" v-model="formShiftData.shiftCode" :minLength="1"
                        ref="shiftCodeInput" :maxLength="20"
                        @blur="formShiftData.shiftCode = formShiftData.shiftCode.trim(); validateShiftCode(formShiftData.shiftCode)"
                        :error="formShiftError.shiftCode" v-tooltip.bottom="formShiftError.shiftCode" />
                </div>
            </div>
            <div class="w-full flex gap-4 items-center mb-[16px]">
                <label class="w-[150px]">
                    Tên ca <span class="text-red-500">*</span>
                </label>
                <div class="flex-1">
                    <MsInput placeholder="Nhập tên ca làm việc" v-model="formShiftData.shiftName" :minLength="1"
                        @blur="formShiftData.shiftName = formShiftData.shiftName.trim(); validateShiftName(formShiftData.shiftName)"
                        ref="shiftNameInput" :maxLength="50" :error="formShiftError.shiftName"
                        v-tooltip.bottom="formShiftError.shiftName" />
                </div>
            </div>

            <div class="w-full flex items-center mb-[16px]">
                <div class="w-1/2 flex gap-4 items-center mr-3">
                    <label class="w-[150px]">
                        Giờ vào ca
                        <span class="text-red-500">*</span>
                    </label>
                    <div class="flex-1 max-w-[122px]">
                        <MsDatepicker placeholder="HH:MM" v-model="formShiftData.shiftBeginTime!"
                            icon="mi-warehouse clock icon16" :type="'time'" ref="shiftBeginTimeInput"
                            @blur="validateShiftBeginTime(formShiftData.shiftBeginTime)" @input="calculateShiftTimes"
                            :error="formShiftError.shiftBeginTime" v-tooltip.bottom="formShiftError.shiftBeginTime" />
                    </div>
                </div>
                <div class="w-1/2 flex gap-4 items-center">
                    <label class="w-[175px]">
                        Giờ hết ca
                        <span class="text-red-500">*</span>
                    </label>
                    <div class="flex-1 max-w-[122px]">
                        <MsDatepicker placeholder="HH:MM" v-model="formShiftData.shiftEndTime!"
                            icon="mi-warehouse clock icon16" :type="'time'" ref="shiftEndTimeInput"
                            @blur="validateShiftEndTime(formShiftData.shiftEndTime)" @input="calculateShiftTimes"
                            :error="formShiftError.shiftEndTime" v-tooltip.bottom="formShiftError.shiftEndTime" />
                    </div>
                </div>
            </div>
            <div class="w-full flex items-center mb-[16px]">
                <div class="w-1/2 flex gap-4 items-center mr-3">
                    <label class="w-[150px]">
                        Bắt đầu nghỉ giữa ca
                    </label>
                    <div class="flex-1 max-w-[122px]">
                        <MsDatepicker ref="shiftBeginBreakTimeInput" placeholder="HH:MM"
                            v-model="formShiftData.shiftBeginBreakTime!" icon="mi-warehouse clock icon16" :type="'time'"
                            @blur="validateShiftBeginBreakTime(formShiftData.shiftBeginBreakTime); validateShiftEndBreakTime(formShiftData.shiftEndBreakTime)"
                            @input="calculateShiftTimes" :error="formShiftError.shiftBeginBreakTime"
                            v-tooltip.bottom="formShiftError.shiftBeginBreakTime" />
                    </div>
                </div>
                <div class="w-1/2 flex gap-4 items-center">
                    <label class="w-[175px]">
                        Kết thúc nghỉ giữa ca
                    </label>
                    <div class="flex-1 max-w-[122px]">
                        <MsDatepicker ref="shiftEndBreakTimeInput" placeholder="HH:MM"
                            v-model="formShiftData.shiftEndBreakTime!" icon="mi-warehouse clock icon16" :type="'time'"
                            @blur="validateShiftEndBreakTime(formShiftData.shiftEndBreakTime); validateShiftBeginBreakTime(formShiftData.shiftBeginBreakTime)"
                            @input="calculateShiftTimes" :error="formShiftError.shiftEndBreakTime"
                            v-tooltip.bottom="formShiftError.shiftEndBreakTime" />
                    </div>
                </div>
            </div>
            <div class="w-full flex items-center mb-[16px]">
                <div class="w-1/2 flex gap-4 items-center mr-3">
                    <label class="w-[150px]">
                        Thời gian làm việc (giờ)
                    </label>
                    <div class="flex-1 max-w-[122px]">
                        <MsInput textAlign="right" type="text" :readonly="true" :disabled="true"
                            :textColor="shiftWorkingTime.startsWith('(') ? 'text-red-500' : ''"
                            v-model="shiftWorkingTime" />
                    </div>
                </div>
                <div class="w-1/2 flex gap-4 items-center">
                    <label class="w-[175px]">
                        Thời gian nghỉ giữa ca (giờ)
                    </label>
                    <div class="flex-1 max-w-[122px]">
                        <MsInput textAlign="right" type="text" :readonly="true" :disabled="true"
                            v-model="shiftBreakingTime" />
                    </div>
                </div>
            </div>

            <div class="w-full flex gap-4 items-start">
                <label class="w-[150px]">
                    Mô tả
                </label>
                <div class="flex-1">
                    <MsTextArea placeholder="Nhập mô tả ca làm việc" :minLength="1" :maxLength="400" />
                </div>
            </div>

            <div v-if="currentState === 'edit'" class="w-full flex gap-4 items-start mt-[16px]">
                <label class="w-[150px]">
                    Trạng thái
                </label>
                <div class="flex-1 flex items-center">
                    <label class="ms-radio mr-4">
                        <input type="radio" name="rdname" tabindex="0" value="true"
                            :checked="!formShiftData.shiftInactive" @change="formShiftData.shiftInactive = false">
                        <span class="checkmark"></span>
                        <div class="flex-column ms-radio-content">
                            <span class="ms-radio--text">Sử dụng</span>
                        </div>
                    </label>
                    <label class="ms-radio mr-4">
                        <input type="radio" name="rdname" tabindex="0" value="true"
                            :checked="formShiftData.shiftInactive" @change="formShiftData.shiftInactive = true">
                        <span class="checkmark"></span>
                        <div class="flex-column ms-radio-content">
                            <span class="ms-radio--text">Ngừng sử dụng</span>
                        </div>
                    </label>
                </div>

            </div>
        </template>
        <template #footer>
            <MsButton class="cancel" @click="handleClose" :label="'Hủy'" variant="outlined" serverity="secondary">
                Hủy
            </MsButton>
            <MsButton class="cancel" @click="handleSave(true);" :label="'Lưu và thêm'" variant="outlined"
                v-tooltip.top="'Ctrl + Shift + S'" serverity="secondary">
                Lưu và thêm
            </MsButton>
            <MsButton class="submit" @click="handleSave(false);" :label="'Xác nhận'" serverity="primary"
                v-tooltip.top="'Ctrl + S'">
                Lưu
            </MsButton>
        </template>
    </MsModal>
</template>
<style lang="scss" scoped>
input:checked~.checkmark {
    border-color: #0e9a62;
}

.ms-radio {
    position: relative;
    display: flex;
    align-items: center;
}

.ms-radio input {
    position: absolute;
    cursor: pointer;
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    margin: 0;
    padding: 0;
    opacity: 0;
}

.checkmark {
    display: inline-block;
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    position: relative;
    border: 1px solid #717680;
    background-color: #fff;
    cursor: pointer;
}

input:checked~.checkmark:before {
    content: "";
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #0e9a62;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


.ms-radio-content {
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    padding-left: 8px;
}

.ms-radio:hover input:not(:disabled)+.checkmark {
    border-color: #0e9a62;
    box-shadow: 0 0 0 2px #0e9a62;
}

.form__popup__header__title {
    flex: 1 1 0%;
    min-width: 0;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    line-height: 36px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;

    .form__popup__header__title__text {
        font-size: 16px;
        font-family: Inter;
        color: #000;
        margin-right: 0;
        white-space: nowrap;
        cursor: text;
    }
}
</style>