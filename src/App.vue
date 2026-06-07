<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import ProductionLayout from './layouts/ProductionLayout.vue'
import MsMessage from './components/base/ms-modal/MsMessage.vue'
import { useMessageStore } from './stores/messageStore';

const messageStore = useMessageStore();

const route = useRoute()
const layoutMap = {
  ProductionLayout: ProductionLayout,
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout
  return layoutMap[layoutName as keyof typeof layoutMap] || ProductionLayout
})
</script>

<template>
  <component :is="currentLayout">
    <!-- View tương ứng với URL sẽ được bơm vào đây và lọt vào <slot /> của Layout đó -->
    <RouterView />
    <!-- <MsMessage  /> -->
    <MsMessage :visible="messageStore.isVisible" :title="messageStore.title" :message="messageStore.message"
      :variant="messageStore.variant" :icon="messageStore.icon" :acceptText="messageStore.acceptText"
      :cancelText="messageStore.cancelText" @close="messageStore.cancel" @cancel="messageStore.cancel"
      @accept="messageStore.accept" />
  </component>

</template>

<style lang="scss"></style>
