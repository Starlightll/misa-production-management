<template lang="html">
  <div class="ms-input" :class="{ 'has-error': error }" :title="error">
    <div class="ms-input-container" :class="{ 'disabled': disabled }">
      <div class="ms-input-content flex-1 flex items-center">
        <i v-if="icon" class="" :class="icon"></i>
        <input class="" :type="inputType" :inputmode="inputMode" :value="displayValue" :placeholder="placeholder"
          @input="handleInput" @blur="handleBlur" @focus="handleFocus" :class="[
            textAlign === 'left' ? 'text-left!' : textAlign === 'right' ? 'text-right!' : textAlign === 'center' ? 'text-center!' : '',
            textColor ? `${textColor}` : '',
          ]" :readonly="readonly" :disabled="disabled" :minlength="minLength" :maxlength="maxLength" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: "text" },
  textAlign: { type: String as () => "left" | "right" | "center", default: "left" },
  textColor: String,
  minLength: Number,
  maxLength: Number,
  placeholder: String,
  icon: String,
  error: String,
  readonly: Boolean,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue", "blur", "input"]);

const displayValue = ref("");
const isFocused = ref(false); // Thêm cờ theo dõi trạng thái focus

const inputType = computed(() => props.type === 'number' ? 'text' : props.type);
const inputMode = computed(() => props.type === 'number' ? 'decimal' : 'text');

// Format ban đầu hoặc khi dữ liệu bị thay đổi từ bên ngoài
watch(
  () => props.modelValue,
  (newVal) => {
    if (props.type === "number") {
      if (newVal == null || newVal === "") {
        displayValue.value = "";
        return;
      }

      // QUAN TRỌNG: Nếu đang gõ phím bên trong ô thì bỏ qua, không ép format .000
      // Để hàm handleInput tự lo việc hiển thị dấu phẩy
      if (isFocused.value) return;

      displayValue.value = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 3, maximumFractionDigits: 3
      }).format(Number(newVal));
    } else {
      displayValue.value = newVal as string || "";
    }
  },
  { immediate: true }
);

/**
 * Xử lý nhập liệu: Gõ đến đâu phẩy đến đó, KHÔNG có .000
 */
const handleInput = async (event: any) => {
  const input = event.target;

  if (props.type === "number") {
    let cursorPosition = input.selectionStart;
    let oldLength = input.value.length;

    // Chỉ giữ số và tối đa 1 dấu chấm
    let rawVal = input.value.replace(/[^\d.]/g, "");
    let parts = rawVal.split(".");
    if (parts.length > 2) parts = [parts[0], parts.slice(1).join("")];

    // Format phẩy hàng nghìn
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let formatted = parts.join(".");

    // Cập nhật giá trị hiển thị (Chỉ có dấu phẩy, chưa có .000)
    displayValue.value = formatted;

    const numValue = parseFloat(rawVal);
    emit("update:modelValue", isNaN(numValue) ? null : numValue);
    emit("input", isNaN(numValue) ? null : numValue);

    // Giữ nguyên con trỏ chuột
    await nextTick();
    cursorPosition += (formatted.length - oldLength);
    input.setSelectionRange(cursorPosition, cursorPosition);
  } else {
    displayValue.value = input.value;
    emit("update:modelValue", input.value);
    emit("input", input.value);
  }
};

/**
 * Blur: Khi rời chuột ra ngoài mới thêm .000
 */
const handleBlur = (event: any) => {
  isFocused.value = false; // Tắt cờ focus

  if (props.type === "number" && displayValue.value) {
    let rawVal = displayValue.value.replace(/,/g, '');
    let parsed = parseFloat(rawVal);
    if (!isNaN(parsed)) {
      displayValue.value = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 3, maximumFractionDigits: 3
      }).format(parsed);
    }
  }
  emit("blur", event);
};

/**
 * Focus: Bỏ đuôi .000 (nếu có) để sửa cho mượt
 */
const handleFocus = () => {
  isFocused.value = true;
  // isFocused.value = true; // Bật cờ focus chặn watch

  // if (props.type === "number" && displayValue.value) {
  //   displayValue.value = displayValue.value.replace(/\.000$/, "");
  // }
};
</script>
<style lang="css" scoped>
input {
  /* height: 32px;
  padding: 2px 16px;
  
  border: 1px solid #D1D5DB;
  border-radius: 8px; */

  outline: none;
  padding: 0;
  display: flex;
  width: 100%;
  border: none;
  background: transparent;
  white-space: nowrap;
  overflow: hidden;
}

input:focus {
  outline: none;
}


/* input:hover {
  border: 1px solid var(--color-gray-400);
}

input:focus {
  border: 1px solid var(--color-primary);
} */

.ms-input {
  background-color: #fff;

}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Dành cho Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.ms-input-container {
  align-items: center;
  column-gap: 4px;
  padding: 5px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  cursor: pointer;
}

.ms-input-container:hover {
  border: 1px solid var(--color-gray-400);
}

.ms-input-container:focus-within {
  border: 1px solid var(--color-primary);
}

.ms-input-content {
  column-gap: 4px;
  min-width: 0;
  align-items: center;
}

.ms-input.has-error {
  .ms-input-container {
    border: 1px solid #f44336 !important;
  }

  .icon {
    background-color: #f44336 !important;
  }
}

/* .ms-input .icon {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translate(0, -50%);
} */

/* .ms-input input {
  padding-left: v-bind('icon ? "32px" : "16px"');
}

.ms-input.has-error input {
  border: 2px solid #f44336 !important;
}

.ms-input.has-error .icon {
  background-color: #f44336 !important;
} */

.checkbox {
  width: 16px;
  height: 16px;
}

.disabled {
  cursor: default !important;
  background-color: #f5f5f5;
  color: #4b5563;
}
</style>
