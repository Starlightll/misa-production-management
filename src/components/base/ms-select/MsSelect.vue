<template lang="html">
  <div class="ms-select" v-click-outside="closeDropdown">
    <div
      class="ms-select-wrapper"
      :class="{ 'has-error': error, disabled: disabled }"
    >
      <i v-if="icon" class="mi icon" :class="icon"></i>
      <input
        type="text"
        class="ms-select-input"
        :placeholder="placeholder"
        :value="selectedLabel"
        @click="toggleDropdown"
      />
      <!-- slots -->
      <slot :name="'customActions'" :toggle="toggleDropdown"></slot>
    </div>
    <!-- dropdown -->
    <transition name="slide">
      <ul v-if="isOpening" class="ms-select-dropdown">
        <!-- header slot -->
        <slot name="optionsHeader"></slot>
        <li
          v-for="option in options"
          :key="option[valueField]"
          class="ms-select-item"
          :class="{ 'is-selected': modelValue === option[valueField] }"
          @click.stop="selectOption(option)"
        >
          {{ option[labelField] }}
          <i v-if="modelValue === option[valueField]" class="fa fa-check"></i>
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
import { ref, computed } from "vue";
const emit = defineEmits(["update:modelValue", "change"]);
const isOpening = ref(false);
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

const toggleDropdown = () => {
  isOpening.value = !isOpening.value;
  console.log("Toggled dropdown, isOpening:", isOpening.value);
};
const closeDropdown = () => {
  isOpening.value = false;
};
const selectOption = (option: any) => {
  emit("update:modelValue", option[props.valueField]);
  emit("change", option);
  isOpening.value = false;
};

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
  border: 1px solid #2970f6;
}

input:focus {
  border: 1px solid #2970f6;
}

.ms-select-wrapper {
  display: flex;
  overflow: hidden;
  border-radius: 3px;
  position: relative;
  border: 1px solid #dddde4;
  height: 32px;
}

.ms-select-wrapper:focus-within {
  border: 1px solid #2970f6;
}

.ms-select-wrapper:hover {
  border: 1px solid #2970f6;
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
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.ms-select-item {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.ms-select-item:hover {
  background-color: #f5f5f5;
}

.ms-select-item.is-selected {
  color: #2970f6;
  font-weight: bold;
  background-color: #e8f5fe;
}

.disabled {
  pointer-events: none;
  opacity: 0.4;
  background-color: #c6c6c6 !important;
}
</style>
