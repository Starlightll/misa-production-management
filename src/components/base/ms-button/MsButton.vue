<template lang="html">
  <button
    class="ms-button"
    :class="`ms-button--${variant}`"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as () =>
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "ghost"
      | "danger",
    default: "primary",
  },
});

const emit = defineEmits(["click"]);

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<style lang="css" scoped>
.ms-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button {
  height: 36px;
  padding: 8px 12px;
}

.ms-button--primary {
  background-color: var(--color-primary);
  color: white;
}

.ms-button--primary:hover {
  background-color: #4097ff !important;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) !important;
}

.ms-button--secondary {
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  color: #1e2633;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) !important;
}

.ms-button--secondary:hover {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.ms-button--success {
  background-color: #28a745;
  color: #fff;
}

.ms-button--warning {
  background-color: #ffc107;
  color: #212529;
}

.ms-button--error {
  background-color: #dc3545;
  color: #fff;
}

.ms-button--ghost {
  background-color: transparent !important;
  color: inherit;
}

.ms-button--danger {
  background-color: #dc3545;
  color: #fff;
}
</style>
