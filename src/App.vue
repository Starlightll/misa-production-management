<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import ProductionLayout from './layouts/ProductionLayout.vue'


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
  </component>
</template>

<style lang="scss"></style>
