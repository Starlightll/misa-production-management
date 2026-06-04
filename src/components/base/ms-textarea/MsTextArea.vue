<template lang="html">
  <div class="ms-textarea-wrapper" :class="{ 'has-error': error }">
    <i v-if="icon" class="mi icon" :class="icon"></i>

    <textarea class="ms-textarea max-h-32" :rows="rows" :value="modelValue" :placeholder="placeholder"
      :minlength="minLength" :maxlength="maxLength" @input="onInput" @blur="$emit('blur', $event)"></textarea>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  icon: String,
  error: String,
  minLength: Number,
  maxLength: Number,
  rows: {
    type: Number,
    default: 3,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const onInput = (event: any) => {
  emit("update:modelValue", event.target.value);
};
</script>
<style lang="css" scoped>
textarea {
  outline: none;
  /* border-radius: 8px; */
  padding: 8px 16px;
  width: 100%;
  resize: vertical;
  min-height: 80px;
}

textarea:hover {
  /* border: 1px solid var(--primary-color); */
}

textarea:focus {
  /* border: 1px solid var(--primary-color); */
}

.ms-textarea-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #dddde4;
}

.ms-textarea-wrapper:focus-within {
  border: 1px solid var(--primary-color) !important;
}

.ms-textarea-wrapper:hover {
  border: 1px solid var(--border-dark);
}

.ms-textarea-wrapper.has-error {
  border: 1px solid #f44336 !important;
}

.ms-textarea-wrapper .icon {
  position: absolute;
  top: 12px;
  left: 5px;
}

.ms-textarea-wrapper textarea {
  padding-left: v-bind('icon ? "32px" : "16px"');
}

/* .ms-textarea-wrapper.has-error textarea {
  border: 2px solid #f44336 !important;
} */

.ms-textarea-wrapper.has-error .icon {
  background-color: #f44336 !important;
}
</style>
