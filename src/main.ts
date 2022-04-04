import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App).use(store)
app.config.unwrapInjectedRef = true
app.mount('#app')
