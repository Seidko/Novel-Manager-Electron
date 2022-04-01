
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App).use(store)
app.config.unwrapInjectedRef = true

if (process.env.NODE_ENV !== 'production') (window as any).vueAPI = (app.mount('#app').$ as any).setupState
