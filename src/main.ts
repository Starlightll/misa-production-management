import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import FloatingVue from 'floating-vue'

const app = createApp(App)

app.use(router).use(FloatingVue)

app.mount('#app')
