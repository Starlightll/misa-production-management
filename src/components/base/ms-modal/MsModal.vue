<template>
  <div class="form__popup" :class="{ hidden: !visible, visible: visible }">
    <div class="form__popup__content">
      <template v-if="$slots.template">
        <slot name="template"></slot>
      </template>
      <template v-else>
        <div class="form__popup__header">
          <template v-if="$slots.header">
            <slot name="header"></slot>
          </template>
          <template v-else>
            <div class="form__popup__header__title">
              <div class="form__popup__header__title__text">{{ title }}</div>
            </div>
            <div v-if="showCloseButton" class="form__popup__close mi-warehouse icon20 close form__popup__close__btn"
              @click="$emit('close')">
            </div>
          </template>
        </div>

        <div class="form__popup__body">
          <template v-if="$slots.body">
            <slot name="body"></slot>
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </div>

        <div class="form__popup__footer gap-2">
          <template v-if="$slots.footer">
            <slot name="footer"></slot>
          </template>
          <template v-else>
            <MsButton class="cancel" @click="$emit('cancel')" :label="'Hủy'" variant="outlined" severity="secondary">
              Hủy
            </MsButton>
            <MsButton class="submit" @click="$emit('submit')" :label="'Xác nhận'" severity="primary">
              Xác nhận
            </MsButton>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import MsButton from '../ms-button/MsButton.vue';
const emit = defineEmits(["close", "cancel", "submit"]);

const handleCloseWithEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    //console.log("Escape key pressed, closing modal.");
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleCloseWithEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleCloseWithEscape);
});

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
  showCloseButton: {
    type: Boolean,
    default: true,
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
  transition: opacity 0.3s ease;
}

.form__popup__content {
  /* background-color: #fff; */
  /* padding: 20px; */
  /* border-radius: 8px; */
  width: v-bind(width);
  height: v-bind(height);
  max-height: 90vh;
  max-width: 90%;
  /* border-radius: 4px; */
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
}

.form__popup__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px 12px 0 0;
  background-color: #fff !important;

  .form__popup__header__title {
    flex: 1 1 0%;
    min-width: 0;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    line-height: 36px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;

    .form__popup__header__title__text {
      font-size: 16px;
      font-family: Inter;
      color: #000;
      margin-right: 0;
      white-space: nowrap;
      cursor: text;
    }
  }
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
  padding: 20px;
  /* overflow: auto; */
  scrollbar-width: thin;
  flex: 1;
  background-color: #fff;
}

.form__popup__footer {
  display: flex;
  justify-content: flex-end;
  border-radius: 0 0 12px 12px;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 20px;
  width: 100% !important;
  border-top: 1px solid var(--border);
  background-color: #fff !important;
}


.form__popup.hidden {
  opacity: 0;
  pointer-events: none;
  /* display: none; */
}

.form__popup.visible {
  opacity: 1;
  /* display: flex; */
}
</style>
