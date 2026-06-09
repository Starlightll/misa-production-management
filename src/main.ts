import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import FloatingVue from 'floating-vue'
import { globalComponents } from './common/globalComponents'
import i18n from './i18n'
import { createPinia } from 'pinia'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const pinia = createPinia();

const app = createApp(App)

app
    .use(router)
    .use(FloatingVue)
    .use(i18n)
    .use(pinia)
    .use(Vue3Toastify, {
        autoClose: 3000,
        position: 'top-center',
        theme: 'colored',
        multiple: true,
        transition: 'slide'
    } as ToastContainerOptions);
globalComponents(app);

app.mount('#app')
