<template>
  <div class="form__popup" :class="{ hidden: !visible, visible: visible }">
    <div class="form__popup__content">
      <div class="form__popup__header">
        <h2>{{ title }}</h2>
        <div
          class="form__popup__close mi__icon__close form__popup__close__btn"
          @click="$emit('close')"
        ></div>
      </div>
      <div class="form__popup__body">
        <slot></slot>
      </div>
      <div class="form__popup__footer">
        <MsButton
          class="cancel"
          @click="$emit('cancel')"
          :label="'Hủy'"
          variant="ghost"
        >
          Hủy
        </MsButton>
        <MsButton
          class="submit"
          @click="$emit('submit')"
          :label="'Xác nhận'"
          variant="primary"
        >
          Xác nhận
        </MsButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import MsButton from "../ms-button/MsButton.vue";

defineEmits(["close", "cancel", "submit"]);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "400px",
  },
  height: {
    type: String,
    default: "auto",
  },
});
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
  width: v-bind(width);
  height: v-bind(height);
  max-height: 90vh;
  max-width: 90%;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.form__popup__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin: 16px 24px 0px 24px;
}

.form__popup__header h2 {
  margin: 0;
}

.form__popup__close {
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.form__popup__body {
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: auto;
  scrollbar-width: thin;
  flex: 1;
}

.form__popup__footer {
  display: flex;
  justify-content: flex-end;
}

.form__popup__footer button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form__popup__footer .cancel {
  /* background-color: #ccc; */
  margin-right: 10px;
}

.form__popup__footer .submit {
  background-color: #2680eb;
  color: white;
}

.form__popup.hidden {
  display: none;
}

.form__popup.visible {
  display: flex;
}

.form__popup__footer {
  display: flex;
  justify-content: flex-end;
  padding: 9px 24px;
  width: 100% !important;
  height: 56px !important;
  border-top: 1px solid #dddde4;
  background-color: #f1f2f5 !important;
}
</style>
