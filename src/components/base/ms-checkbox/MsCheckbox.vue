<template lang="html">
    <label class="ms-checkbox" :class="{ 'has-error': error, disabled: disabled }" :title="error">
        <input ref="inputRef" class="ms-checkbox__input" type="checkbox" :checked="isChecked" :disabled="disabled"
            :readonly="readonly" @change="onChange" @blur="$emit('blur', $event)" />
        <span v-if="label" class="ms-checkbox__label">{{ label }}</span>
    </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
    modelValue: {
        type: [Boolean, String, Number] as any,
        default: false,
    },
    label: String,
    disabled: Boolean,
    readonly: Boolean,
    error: String,
    trueValue: {
        type: [Boolean, String, Number] as any,
        default: true,
    },
    falseValue: {
        type: [Boolean, String, Number] as any,
        default: false,
    },
    indeterminate: Boolean,
});

const emit = defineEmits(["update:modelValue", "change", "blur"]);

const inputRef = ref<HTMLInputElement | null>(null);

const isChecked = computed(() => props.modelValue === props.trueValue);

const syncIndeterminate = () => {
    if (inputRef.value) {
        inputRef.value.indeterminate = !!props.indeterminate;
    }
};

watch(
    () => props.indeterminate,
    () => {
        syncIndeterminate();
    },
);

onMounted(() => {
    syncIndeterminate();
});

const onChange = (event: Event) => {
    if (props.disabled || props.readonly) {
        return;
    }
    const target = event.target as HTMLInputElement;
    const nextValue = target.checked ? props.trueValue : props.falseValue;
    emit("update:modelValue", nextValue);
    emit("change", nextValue);
};
</script>

<style lang="css" scoped>
.ms-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.ms-checkbox__input {
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    accent-color: var(--checkbox-accent);
    border: 1px solid var(--checkbox-border);
    background-color: var(--checkbox-bg);
    border-radius: 2px;
    cursor: pointer;
}

.ms-checkbox__label {
    font-size: 13px;
    color: var(--checkbox-label);
}

.ms-checkbox.has-error .ms-checkbox__input {
    outline: 1px solid var(--checkbox-error);
    border-radius: 2px;
}

.ms-checkbox.disabled {
    cursor: default;
    opacity: var(--checkbox-disabled-opacity);
}

.ms-checkbox.disabled .ms-checkbox__input {
    cursor: default;
}
</style>
