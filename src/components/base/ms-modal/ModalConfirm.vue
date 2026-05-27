<template lang="html">
  <div class="form__popup" :class="{ hidden: !visible, visible: visible }">
    <div class="form__popup__content">
      <div class="form__popup__header">
        <h2>{{ title }}</h2>
        <div class="form__popup__close mi__icon__close form__popup__close__btn" @click="$emit('close')"></div>
      </div>
      <div class="form__popup__body">
        <p class="mb-4">{{ message }}</p>
      </div>
      <div class="form__popup__footer">
        <MsButton class="cancel" @click="$emit('cancel')" :label="'Hủy'" variant="text">Hủy</MsButton>
        <MsButton class="confirm" @click="$emit('confirm')" :label="'Xác nhận'"
          :severity="variant === 'danger' ? 'danger' : 'primary'">
          Xác nhận
        </MsButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import MsButton from "../ms-button/MsButton.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  variant: {
    type: String as () => "info" | "warning" | "error" | "success" | "danger",
    default: "info",
  },
});

const emit = defineEmits(["cancel", "confirm", "close"]);
</script>

<style lang="css" scoped>
.form__popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form__popup__content {
  background-color: #fff;
  /* padding: 20px; */
  border-radius: 8px;
  height: auto;
}

.form__popup__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.form__popup__body {
  padding: 16px;
}

.form__popup__footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #eee;
}

.hidden {
  display: none;
}
</style>
