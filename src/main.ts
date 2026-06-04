import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import FloatingVue from 'floating-vue'
import i18n from './i18n'

const app = createApp(App)

app.use(router).use(FloatingVue).use(i18n)

app.mount('#app')
