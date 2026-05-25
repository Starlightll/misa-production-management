<template lang="html">
  <div class="ms-input-wrapper" :class="{ 'has-error': error }" :title="error">
    <!-- Icon phía trước (Prefix Icon) -->
    <i v-if="icon" class="mi icon" :class="icon"></i>

    <input
      class="ms-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      @blur="$emit('blur', $event)"
    />
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
  border: 1px solid #dddde4;
  height: 32px;
  outline: none;
  border-radius: 3px;
  padding: 2px 16px;
  width: 100%;
}

input:hover {
  border: 1px solid #2970f6;
}

input:focus {
  border: 1px solid #2970f6;
}

.ms-input-wrapper {
  position: relative;
}

.ms-input-wrapper .icon {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translate(0, -50%);
}

.ms-input-wrapper input {
  padding-left: v-bind('icon ? "32px" : "16px"');
}

.ms-input-wrapper.has-error input {
  border: 2px solid #f44336 !important;
}

.ms-input-wrapper.has-error .icon {
  background-color: #f44336 !important;
}

.checkbox {
  width: 16px;
  height: 16px;
}
</style>
