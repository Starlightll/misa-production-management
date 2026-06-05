import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import FloatingVue from 'floating-vue'
import { globalComponents } from './common/globalComponents'
import i18n from './i18n'

const app = createApp(App)

app.use(router).use(FloatingVue).use(i18n)
globalComponents(app);

app.mount('#app')
