<template>
  <div class="ms-datepicker" @focusout="handleBlur">
    <div
      class="ms-datepicker-wrapper"
      :class="{ 'has-error': error }"
      :title="error"
    >
      <!-- Icon phía trước -->
      <i v-if="icon" class="mi icon" :class="icon"></i>

      <!-- Input hiển thị (Dạng văn bản dd/mm/yyyy) -->
      <input
        type="text"
        class="ms-datepicker-input"
        :placeholder="placeholder"
        :value="displayValue"
        @input="onTextInput"
      />

      <!-- Khu vực chứa input native và icon -->
      <div class="ms-datepicker-wrapper__datepicker__button">
        <!-- Input ẩn nhưng vẫn nhận sự kiện chọn ngày -->
        <input
          :type="type"
          class="ms-datepicker-wrapper__native"
          :value="formatModalValue(modelValue || '')"
          @change="onPickerChange"
        />
        <div class="icon mi__icon__calendar"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: "DD/MM/YYYY" },
  type: {
    type: String,
    default: "date", // Hoặc "month", "year" tùy nhu cầu
  },
  icon: String,
  error: String,
});

const emit = defineEmits(["update:modelValue", "blur"]);

const handleBlur = (event: FocusEvent) => {
  const container = event.currentTarget as HTMLElement;
  const nextTarget = event.relatedTarget as HTMLElement;
  if (!container.contains(nextTarget)) {
    console.log("Datepicker blurred");
    emit("blur", event);
  }
};

// Hàm chuyển đổi từ 15/09/2003 sang 2003-09-15 để phù hợp với input type="date"
const formatModalValue = (isoDate: string) => {
  if (!isoDate) return "";
  // Nếu là type month, định dạng sẽ là mm/yyyy
  if (props.type === "month") {
    // console.log("Formatting modal value:", isoDate);

    const regex = /^(\d{2})\/(\d{4})$/;
    if (!regex.test(isoDate)) return new Date().toISOString().slice(0, 7); // Trả về yyyy-mm nếu không đúng định dạng
    const parts = isoDate.split("/"); // [mm, yyyy]
    // console.log("Parts after split:", parts[0] + "-" + parts[1]);
    if (parts.length !== 2) return isoDate;
    return `${parts[1]}-${parts[0]}`;
  } else if (props.type === "year") {
    const regex = /^(\d{4})$/;
    if (!regex.test(isoDate)) return new Date().getFullYear().toString();
    return isoDate;
  } else {
    // check match regex nếu không trả new Date() để tránh lỗi khi người dùng gõ tay không đúng định dạng
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(isoDate)) return new Date().toISOString().split("T")[0];
    const parts = isoDate.split("/"); // [dd, mm, yyyy]
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
};

/**
 * Logic 1: Chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy để hiển thị
 */
const displayValue = computed(() => {
  if (!props.modelValue) return "";
  const parts = props.modelValue.split("-"); // [yyyy, mm, dd]
  if (parts.length !== 3) return props.modelValue;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

/**
 * Logic 2: Khi người dùng chọn ngày từ lịch (Picker)
 */
const onPickerChange = (event: any) => {
  const val = event.target.value; // Dạng yyyy-mm-dd
  const parts = val.split("-"); // [yyyy, mm, dd]
  // Check nếu là type month hoặc year thì sẽ có định dạng khác
  if (props.type === "month") {
    const monthParts = val.split("-"); // [yyyy, mm]
    if (monthParts.length !== 2) {
      emit("update:modelValue", val);
      return;
    }
    const isoDate = `${monthParts[1]}/${monthParts[0]}`; // Chuyển sang mm/yyyy
    emit("update:modelValue", isoDate);
    return;
  } else if (props.type === "year") {
    const yearParts = val.split("-"); // [yyyy]
    if (yearParts.length !== 1) {
      emit("update:modelValue", val);
      return;
    }
    emit("update:modelValue", yearParts[0]);
    return;
  } else {
    if (parts.length !== 3) {
      emit("update:modelValue", val);
      return;
    }
    const isoDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // Chuyển sang dd/mm/yyyy
    emit("update:modelValue", isoDate);
  }
};

/**
 * Logic 3: (Tùy chọn) Khi người dùng gõ trực tiếp vào ô text
 * Nếu muốn hỗ trợ gõ tay dd/mm/yyyy rồi tự đổi sang yyyy-mm-dd
 */
const onTextInput = (event: any) => {
  //   const val = event.target.value;
  //   // Regex kiểm tra định dạng
  //   const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  //   const match = val.match(regex);

  //   if (match) {
  //     const isoDate = `${match[3]}-${match[2]}-${match[1]}`;
  //     console.log("Parsed date from text input:", isoDate);
  //     emit("update:modelValue", isoDate);
  //   }

  // Luôn cập nhật giá trị hiển thị, nhưng chỉ emit khi đúng định dạng
  emit("update:modelValue", event.target.value);
};
</script>
<style lang="css" scoped>
.ms-datepicker-wrapper {
  display: flex;
  border: 1px solid #dddde4;
  border-radius: 3px;
}

.ms-datepicker-wrapper:hover {
  border: 1px solid var(--color-primary);
}

.ms-datepicker-wrapper:focus-within {
  border: 1px solid var(--color-primary);
}

.ms-datepicker-wrapper input {
  border: none;
}

.ms-datepicker-wrapper__datepicker__button {
  width: 32px;
  height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #dddde4;
  padding: 8px;
  overflow: hidden;
  cursor: pointer;
}

.ms-datepicker-wrapper__datepicker__button .icon {
  background-color: #6b6b6b;
  pointer-events: none;
}

.ms-datepicker-wrapper__native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.ms-datepicker-wrapper__native::-webkit-calendar-picker-indicator {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.ms-datepicker {
  position: relative;
  width: 100%;
}

input {
  outline: none;
  width: 100%;
  padding: 2px 16px;
}

input:hover {
  border: 1px solid #2970f6;
}

input:focus {
  border: 1px solid #2970f6;
}

.ms-datepicker-wrapper {
  display: flex;
  overflow: hidden;
  border-radius: 3px;
  position: relative;
  border: 1px solid #dddde4;
  height: 32px;
}

.ms-datepicker-wrapper:focus-within {
  border: 1px solid #2970f6;
}

.ms-datepicker-wrapper:hover {
  border: 1px solid #2970f6;
}

.ms-datepicker-wrapper .icon {
  position: absolute;
  top: 50%;
  /* left: 5px; */
  transform: translate(0, -50%);
}

.ms-datepicker-wrapper input {
  padding-left: v-bind('icon ? "32px" : "16px"');
  border: none !important;
}

.ms-datepicker-wrapper.has-error {
  border: 2px solid #f44336 !important;
}

.ms-datepicker-wrapper.has-error .icon {
  background-color: #f44336 !important;
}

.ms-datepicker-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.ms-datepicker-item {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.ms-datepicker-item:hover {
  background-color: #f5f5f5;
}

.ms-datepicker-item.is-selected {
  color: #4caf50;
  font-weight: bold;
  background-color: #e8f5e9;
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
