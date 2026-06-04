<template lang="html">
  <button class="ms-button" :class="buttonClasses" :type="type" :disabled="disabled" @click="handleClick">
    <slot v-if="hasDefaultSlot"></slot>
    <span v-else>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

type Severity = "primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger";
type Variant = "solid" | "outlined" | "text";

const props = defineProps({
  serverity: {
    type: String as () => Severity,
    default: undefined,
  },
  variant: {
    type: String as () => Variant,
    default: "solid",
  },
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String as () => "button" | "submit" | "reset",
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);

const resolvedSeverity = computed(() => props.serverity || "primary");
const buttonClasses = computed(() => [
  `ms-button--${resolvedSeverity.value}`,
  `ms-button--${props.variant}`,
  { "is-disabled": props.disabled },
]);

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    return;
  }
  emit("click", event);
};
</script>

<style lang="scss" scoped>
/* ====================
   BASE BUTTON
==================== */
.ms-button {
  border: 1px solid transparent;
  /* Giữ border trong suốt để nút không bị giật kích thước khi chuyển sang outlined */
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  padding: 6px 12px;
  border-radius: 8px;
  position: relative;
  font-size: 13px;
  height: 28px;
  font-weight: 500;
  box-sizing: border-box;
}

.ms-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none !important;
  pointer-events: none;
  /* Ngăn chặn hover khi disabled */
}

/* ====================
   SEVERITIES (Màu sắc)
   Sử dụng biến CSS để lưu trữ màu gốc, màu đậm (hover) và rgb (để làm opacity)
==================== */
.ms-button--primary {
  --btn-color: var(--color-primary);
  --btn-color-dark: var(--color-primary-hover);
  --btn-color-rgb: var(--color-primary-rgb);
  --btn-text: #ffffff;
}

.ms-button--secondary {
  --btn-color: var(--color-secondary);
  --btn-color-dark: var(--color-secondary-hover);
  --btn-color-rgb: var(--color-secondary-rgb);
  --btn-text: #ffffff;
}

.ms-button--success {
  --btn-color: var(--color-success);
  --btn-color-dark: var(--color-success-hover);
  --btn-color-rgb: var(--color-success-rgb);
  --btn-text: #ffffff;
}

.ms-button--info {
  --btn-color: var(--color-info);
  --btn-color-dark: var(--color-info-hover);
  --btn-color-rgb: var(--color-info-rgb);
  --btn-text: #ffffff;
}

.ms-button--warning {
  --btn-color: var(--color-warning);
  --btn-color-dark: var(--color-warning-hover);
  --btn-color-rgb: var(--color-warning-rgb);
  --btn-text: #ffffff;
}

.ms-button--help {
  --btn-color: var(--color-help);
  --btn-color-dark: var(--color-help-hover);
  --btn-color-rgb: var(--color-help-rgb);
  --btn-text: #ffffff;
}

.ms-button--danger {
  --btn-color: var(--color-danger);
  --btn-color-dark: var(--color-danger-hover);
  --btn-color-rgb: var(--color-danger-rgb);
  --btn-text: #ffffff;
}

/* ====================
   VARIANTS (Kiểu dáng)
==================== */

/* 1. SOLID: Nền màu, chữ trắng, không border (border transparent), hover đậm hơn */
.ms-button--solid {
  background-color: var(--btn-color);
  color: var(--btn-text);
  border-color: transparent;

  .icon {
    background-color: var(--btn-text);
  }
}

.ms-button--solid:hover {
  background-color: var(--btn-color-dark);
}

/* 2. OUTLINED: Nền trong suốt, có border màu, chữ màu, hover nền có opacity 0.15 */
.ms-button--outlined {
  background-color: transparent;
  // color: var(--btn-color);
  border-color: var(--btn-color);

  .icon {
    background-color: var(--btn-color) !important;
  }
}

.ms-button--outlined:hover {
  background-color: rgba(var(--btn-color-rgb), 0.20);
}

.ms-button--outlined:active {
  background-color: rgba(var(--btn-color-rgb), 0.35);
}

/* 3. TEXT: Nền trong suốt, không border, chữ màu, hover nền có opacity 0.15 */
.ms-button--text {
  background-color: transparent;
  color: var(--btn-color);
  border-color: transparent;
}

.ms-button--text:hover {
  background-color: rgba(var(--btn-color-rgb), 0.25);
}

/* 4. LINK: Giống text nhưng hover thường có gạch chân thay vì nền (Tùy chọn) */
.ms-button--link {
  background-color: transparent;
  color: var(--btn-color);
  border-color: transparent;
  padding-left: 4px;
  padding-right: 4px;
}

.ms-button--link:hover {
  text-decoration: underline;
  /* Nếu bạn vẫn muốn có background opacity thì mở comment dòng dưới: */
  /* background-color: rgba(var(--btn-color-rgb), 0.15); */
}
</style>
