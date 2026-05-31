<template lang="html">
  <div class="ms-select" v-click-outside="closeDropdown">
    <div ref="triggerRef" class="ms-select-wrapper" :class="{ 'has-error': error, disabled: disabled }"
      @click="toggleDropdown">
      <i v-if="icon" class="mi icon" :class="icon"></i>
      <input type="text" class="ms-select-input" :placeholder="placeholder" :value="selectedLabel" readonly />
      <!-- slots -->
      <slot :name="'customActions'" :toggle="toggleDropdown"></slot>
      <i class="mi-warehouse icon16 icon angle-down cursor-pointer" :class="{ 'is-open': isOpening }"></i>
    </div>
    <!-- dropdown -->
    <transition name="slide">
      <ul v-if="isOpening" ref="dropdownRef" class="ms-select-dropdown"
        :class="{ 'is-top': dropdownPlacement === 'top' }">
        <!-- header slot -->
        <slot name="optionsHeader"></slot>
        <li v-for="option in options" :key="option[valueField]" class="ms-select-item"
          :class="{ 'is-selected': modelValue === option[valueField] }" @click.stop="selectOption(option)">
          {{ option[labelField] }}
          <!-- <i class="fa fa-check"></i> -->
          <div v-if="modelValue === option[valueField]" class="select-checked select-checked-not-col"></div>
        </li>
        <li v-if="options.length === 0" class="ms-select-no-data">
          Không có dữ liệu
        </li>
        <slot name="optionsFooter"></slot>
      </ul>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from "vue";
const emit = defineEmits(["update:modelValue", "change"]);
const isOpening = ref(false);
const dropdownPlacement = ref<"top" | "bottom">("bottom");
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array as any,
    default: () => [],
  },
  label: String,
  icon: String,
  placeholder: { type: String, default: "- Chọn giá trị -" },
  labelField: { type: String, default: "text" },
  valueField: { type: String, default: "value" },
  disabled: Boolean,
  error: String,
});


const selectedLabel = computed(() => {
  const selected = props.options.find(
    (opt: any) => opt[props.valueField] === props.modelValue,
  );
  return selected ? selected[props.labelField] : "";
});

const updateDropdownPlacement = () => {
  const trigger = triggerRef.value;
  const dropdown = dropdownRef.value;
  if (!trigger || !dropdown) {
    return;
  }
  const rect = trigger.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const maxHeight = 200;
  const dropdownHeight = Math.min(dropdown.scrollHeight, maxHeight);
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;

  dropdownPlacement.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "top" : "bottom";
};

const toggleDropdown = async () => {
  isOpening.value = !isOpening.value;
  if (isOpening.value) {
    await nextTick();
    updateDropdownPlacement();
    window.addEventListener("resize", updateDropdownPlacement);
    window.addEventListener("scroll", updateDropdownPlacement, true);
  } else {
    window.removeEventListener("resize", updateDropdownPlacement);
    window.removeEventListener("scroll", updateDropdownPlacement, true);
  }
};
const closeDropdown = () => {
  isOpening.value = false;
  window.removeEventListener("resize", updateDropdownPlacement);
  window.removeEventListener("scroll", updateDropdownPlacement, true);
};
const selectOption = (option: any) => {
  emit("update:modelValue", option[props.valueField]);
  emit("change", option);
  isOpening.value = false;
  window.removeEventListener("resize", updateDropdownPlacement);
  window.removeEventListener("scroll", updateDropdownPlacement, true);
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDropdownPlacement);
  window.removeEventListener("scroll", updateDropdownPlacement, true);
});

// handle click outside
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style lang="css" scoped>
.ms-select {
  position: relative;
  width: 100%;
}

input {
  outline: none;
  width: 100%;
  padding: 2px 16px;
}

input:hover {
  border: 1px solid var(--border-hover, #c6c6c6);
}

input:focus {
  border: 1px solid var(--color-primary);
}

.ms-select-wrapper {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  border: 1px solid #dddde4;
  height: 28px;

  .angle-down {
    transition: all 0.2s ease;
    right: 8px !important;
    left: auto !important;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 1;

    &.is-open {
      transform: translate(0, -50%) rotate(-180deg);
    }
  }

}

.ms-select-wrapper:focus-within {
  border: 1px solid var(--color-primary) !important;
}

.ms-select-wrapper:hover {
  border: 1px solid var(--border-hover, #c6c6c6);
}

.ms-select-wrapper .icon {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translate(0, -50%);
}

.ms-select-wrapper input {
  padding-left: v-bind('icon ? "32px" : "16px"');
  border: none !important;
}

.ms-select-wrapper.has-error {
  border: 2px solid #f44336 !important;
}

.ms-select-wrapper.has-error .icon {
  background-color: #f44336 !important;
}

.ms-select-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.ms-select-dropdown.is-top {
  top: auto;
  bottom: 105%;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.ms-select-dropdown.is-top.slide-enter-from,
.ms-select-dropdown.is-top.slide-leave-to {
  transform: translateY(6px);
}

.ms-select-item {
  padding: 6px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.ms-select-item:hover {
  background-color: #f5f5f5;
}

.ms-select-item.is-selected {
  color: var(--color-primary);
  font-weight: bold;
  background-color: var(--primary-soft-light);
}

.disabled {
  pointer-events: none;
  opacity: 0.4;
  background-color: #c6c6c6 !important;
}

.select-checked {
  width: 10px;
  height: 5.67px;
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: #0e9a62;
  transform: translateY(-2px) rotate(-45deg);
}
</style>
