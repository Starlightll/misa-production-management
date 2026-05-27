<template lang="html">
  <div class="ms-input" :class="{ 'has-error': error }" :title="error">
    <!-- Icon phía trước (Prefix Icon) -->
    <div class="ms-input-container">
      <div class="ms-input-content flex-1 flex items-center">
        <i v-if="icon" class="" :class="icon"></i>
        <input class="" :type="type" :value="modelValue" :placeholder="placeholder" @input="onInput"
          @blur="$emit('blur', $event)" />
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: [String, Number], // Giá trị mặc định của v-model
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  icon: String, // Ví dụ: 'fa-user'
  error: String, // Thông báo lỗi truyền từ cha vào
});

const emit = defineEmits(["update:modelValue", "blur"]);

/**
 * Xử lý khi người dùng nhập liệu
 * Phát ra sự kiện update:modelValue để đồng bộ với cha
 */
const onInput = (event: any) => {
  emit("update:modelValue", event.target.value);
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
</style>
