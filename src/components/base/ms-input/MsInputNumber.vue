<template lang="html">
  <div class="ms-input" :class="{ 'has-error': error }" :title="error">
    <div class="ms-input-container" :class="{ 'disabled': disabled }">
      <div class="ms-input-content flex-1 flex items-center">
        <i v-if="icon" class="" :class="icon"></i>
        <input class="" :type="inputType" :inputmode="inputMode" :value="displayValue" :placeholder="placeholder"
          @input="handleInput" @blur="handleBlur" @focus="handleFocus" :class="[
            textAlign === 'left' ? 'text-left!' : textAlign === 'right' ? 'text-right!' : textAlign === 'center' ? 'text-center!' : '',
            textColor ? `${textColor}` : '',
          ]" :readonly="readonly" :disabled="disabled" :minlength="minLength" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number], // Giá trị mặc định của v-model
  label: String,
  type: {
    type: String,
    default: "text",
  },
  textAlign: {
    type: String as () => "left" | "right" | "center",
    default: "left",
  },
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

// Biến lưu trữ giá trị hiển thị trên UI (có phẩy, có chấm)
const displayValue = ref("");

// Ép kiểu input thành text nếu type là number để cho phép hiển thị dấu phẩy
const inputType = computed(() => {
  return props.type === 'number' ? 'text' : props.type;
});

// Thuộc tính hỗ trợ bàn phím số trên điện thoại
const inputMode = computed(() => {
  return props.type === 'number' ? 'decimal' : 'text';
});

/**
 * Hàm Format số
 * @param value Giá trị cần format
 * @param isBlur Cờ kiểm tra xem có đang ở sự kiện blur không (để thêm .000)
 */
const formatNumberString = (value: any, isBlur = false) => {
  if (value === null || value === undefined || value === "") return "";

  // 1. Loại bỏ tất cả ký tự không hợp lệ (chỉ giữ lại số, dấu phẩy, dấu chấm, dấu trừ)
  // Sau đó loại bỏ luôn dấu phẩy để lấy giá trị số thô
  let rawStr = String(value).replace(/,/g, "").replace(/[^\d.-]/g, "");

  if (!rawStr || isNaN(Number(rawStr))) return rawStr; // Fallback nếu không phải số

  let parts = rawStr.split(".");
  let intPart = parts[0];

  // 2. Format hàng nghìn cho phần nguyên (vd: 100000 -> 100,000)
  if (intPart) {
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 3. Xử lý khi Blur (Thêm .000)
  if (isBlur) {
    const parsedNum = parseFloat(rawStr);
    if (!isNaN(parsedNum)) {
      const fixedStr = parsedNum.toFixed(3); // Ép cứng 3 số sau dấu thập phân
      const fixedParts = fixedStr.split(".");
      return fixedParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + fixedParts[1];
    }
  }

  // 4. Trả về kết quả khi đang gõ (chưa blur)
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
};

// Theo dõi modelValue từ component cha để format lần đầu tiên
watch(
  () => props.modelValue,
  (newVal) => {
    if (props.type === "number") {
      // Khi cha truyền số xuống, ta format luôn thành chuẩn có .000
      displayValue.value = formatNumberString(newVal, true);
    } else {
      displayValue.value = newVal as string;
    }
  },
  { immediate: true }
);

/**
 * Xử lý khi đang nhập liệu
 */
const handleInput = (event: any) => {
  let rawValue = event.target.value;

  if (props.type === "number") {
    // Không cho phép nhập 2 dấu chấm
    const dotCount = (rawValue.match(/\./g) || []).length;
    if (dotCount > 1) {
      rawValue = rawValue.substring(0, rawValue.lastIndexOf("."));
    }

    // Format hiển thị trên ô input ngay lập tức (hiện dấu phẩy)
    displayValue.value = formatNumberString(rawValue, false);

    // Bắn giá trị SỐ THỰC (không phẩy) ra Component cha
    const numValue = parseFloat(rawValue.replace(/,/g, ""));
    emit("update:modelValue", isNaN(numValue) ? null : numValue);
    emit("input", isNaN(numValue) ? null : numValue);
  } else {
    displayValue.value = rawValue;
    emit("update:modelValue", rawValue);
    emit("input", rawValue);
  }
};

/**
 * Xử lý khi click ra ngoài (Blur)
 */
const handleBlur = (event: any) => {
  if (props.type === "number") {
    // Format ép cứng .000 khi người dùng bỏ trỏ chuột
    displayValue.value = formatNumberString(displayValue.value, true);
  }
  emit("blur", event);
};

/**
 * Xử lý khi click vào ô input (Tùy chọn: Xóa .000 đi để user dễ sửa số hơn)
 */
const handleFocus = () => {
  if (props.type === "number" && displayValue.value) {
    // Cắt bỏ đuôi .000 nếu phần thập phân đang rỗng, giúp UX lúc gõ đỡ bị rối
    displayValue.value = displayValue.value.replace(/\.000$/, "");
  }
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
