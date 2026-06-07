<template lang="html">
  <div class="form__popup" :class="{ hidden: !visible, visible: visible }">
    <div class="form__popup__content">
      <template v-if="$slots.template">
        <slot name="template"></slot>
      </template>
      <div v-else class="message-modal w-108">
        <!-- Header -->
        <div class="message-modal__header flex items-center justify-between mb-4">
          <div class="flex items-center">
            <!-- Icon -->
            <div v-if="icon" class="icon icon20 mr-2" :class="icon"></div>
            <template v-else>
              <div v-if="variant === 'warning'" class="icon icon20 mi-qtsx icon-warning bg-(--color-warning)! mr-2">
              </div>
              <div v-if="variant === 'danger'" class="icon icon20 mi-qtsx icon-danger bg-(--color-danger)! mr-2">
              </div>
              <div v-if="variant === 'info'" class="icon icon20 mi-qtsx icon-info bg-(--color-info)! mr-2">
              </div>
            </template>
            <!-- Title -->
            <div class="message-modal__title">{{ title }}</div>
          </div>
          <div class="flex items-center h-6 w-6 justify-center cursor-pointer" v-tooltip.top="'Đóng (ESC)'"
            @click="$emit('close')">
            <div class="icon icon20 mi-warehouse close"></div>
          </div>
        </div>
        <!-- Message -->
        <div class="message-modal__message" v-html="message"></div>
        <!-- Actions -->
        <div class="confirm-modal__actions flex items-center justify-end gap-2 mt-4">
          <MsButton class="cancel" @click="$emit('cancel')" variant="outlined" serverity="secondary">
            {{ cancelText }}
          </MsButton>
          <MsButton class="submit" @click="$emit('accept')" :serverity="variant === 'danger' ? 'danger' : 'primary'">
            {{ acceptText }}
          </MsButton>
        </div>
      </div>
      <!-- <template v-else>
        <div class="form__popup__header">
          <h2>{{ title }}</h2>
          <div class="form__popup__close mi__icon__close form__popup__close__btn" @click="$emit('close')"></div>
        </div>
        <div class="form__popup__body">
          <div class="mb-4" v-html="message"></div>
        </div>
        <div class="form__popup__footer">
          <MsButton class="cancel" @click="$emit('cancel')" :label="cancelText" variant="text">{{ cancelText }}</MsButton>
          <MsButton class="confirm" @click="$emit('accept')" :label="acceptText"
            :severity="variant === 'danger' ? 'danger' : 'primary'">
            {{ acceptText }}
          </MsButton>
        </div>
      </template> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import MsButton from "../ms-button/MsButton.vue";

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
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
  acceptText: {
    type: String,
    default: 'Đồng ý',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  variant: {
    type: String as () => "info" | "warning" | "error" | "success" | "danger",
    default: "info",
  },
});

const emit = defineEmits(["cancel", "accept", "close"]);
</script>

<style lang="scss" scoped>
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
  border-radius: 12px;
  box-shadow: 0 3px 20px #00000014;
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

.message-modal {
  background-color: #fff;
  box-shadow: 0 3px 20px #00000014;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &__title {
    font-weight: 600;
    color: var(--text);
    font-size: 16px;
  }

  &__message {
    font-size: 13px;
    max-height: 400px;
    overflow-y: auto;
    font-weight: 400;
    line-height: 20px;
    max-width: 100%;
    overflow-wrap: anywhere;
  }
}
</style>
