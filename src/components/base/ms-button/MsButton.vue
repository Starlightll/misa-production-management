<template lang="html">
  <button class="ms-button" :class="buttonClasses" :type="type" :disabled="disabled" @click="handleClick">
    <slot v-if="hasDefaultSlot"></slot>
    <span v-else>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

type Severity = "primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger";
type Variant = "solid" | "outlined" | "text" | "link";

const props = defineProps({
  severity: {
    type: String as () => Severity,
    default: "primary",
  },
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

const resolvedSeverity = computed(() => props.severity || props.serverity || "primary");
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

<style lang="css" scoped>
.ms-button {
  border: none;
  transition: all .2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  padding: 6px 12px;
  border-radius: 8px;
  position: relative;
  font-size: 13px;
  height: 28px;
  background-color: var(--ms-button-bg, #fff);
  color: var(--ms-button-text, #1e2633);
  font-weight: 500;
}

.ms-button--outlined {
  /* background-color: transparent; */
  color: var(--ms-button-main, var(--color-primary));
  /* border: 1px solid var(--ms-button-main, var(--color-primary)); */
  border: 1px solid #D5D7DA;
  color: #000;
  background-color: #fff;
}

.ms-button--text {
  background-color: transparent;
  border-color: transparent;
  color: var(--ms-button-main, var(--color-primary));
}

.ms-button--link {
  background-color: transparent;
  border-color: transparent;
  color: var(--ms-button-main, var(--color-primary));
  padding: 0;
}

.ms-button--outlined:hover,
.ms-button--text:hover,
.ms-button--link:hover {
  color: var(--ms-button-main-hover, var(--color-primary-hover));
  /* border-color: var(--ms-button-main-hover, var(--color-primary-hover)); */
  background-color: var(--ms-button-bg-hover, var(--color-bg-hover));
}

.ms-button--primary {
  --ms-button-main: var(--color-primary);
  --ms-button-bg: var(--color-primary);
  --ms-button-text: #fff;
  --ms-button-border: var(--color-primary);
  --ms-button-main-hover: var(--color-primary-hover);
  --ms-button-bg-hover: var(--color-primary-hover);
}

.ms-button--secondary {
  --ms-button-main: var(--color-secondary);
  --ms-button-bg: #ffffff;
  --ms-button-text: var(--color-secondary);
  --ms-button-border: var(--color-border);
  --ms-button-main-hover: var(--color-secondary-hover);
  --ms-button-bg-hover: #e5e7eb;
}

.ms-button--success {
  --ms-button-main: var(--color-success);
  --ms-button-bg: var(--color-success);
  --ms-button-text: #fff;
  --ms-button-border: var(--color-success);
  --ms-button-main-hover: var(--color-success-hover);
  --ms-button-bg-hover: var(--color-success-hover);
}

.ms-button--info {
  --ms-button-main: var(--color-info);
  --ms-button-bg: var(--color-info);
  --ms-button-text: #fff;
  --ms-button-border: var(--color-info);
  --ms-button-main-hover: var(--color-info-hover);
  --ms-button-bg-hover: var(--color-info-hover);
}

.ms-button--warning {
  --ms-button-main: var(--color-warning);
  --ms-button-bg: var(--color-warning);
  --ms-button-text: #212529;
  --ms-button-border: var(--color-warning);
  --ms-button-main-hover: var(--color-warning-hover);
  --ms-button-bg-hover: var(--color-warning-hover);
}

.ms-button--help {
  --ms-button-main: var(--color-help);
  --ms-button-bg: var(--color-help);
  --ms-button-text: #fff;
  --ms-button-border: var(--color-help);
  --ms-button-main-hover: var(--color-help-hover);
  --ms-button-bg-hover: var(--color-help-hover);
}

.ms-button--danger {
  --ms-button-main: var(--color-danger);
  --ms-button-bg: var(--color-danger);
  --ms-button-text: #fff;
  --ms-button-border: var(--color-danger);
  --ms-button-main-hover: var(--color-danger-hover);
  --ms-button-bg-hover: var(--color-danger-hover);
}

.ms-button--solid:hover {
  background-color: var(--ms-button-bg-hover, var(--ms-button-bg));
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) !important;
}

.ms-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none !important;
}
</style>
