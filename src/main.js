import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const MainApp = createApp(App)
MainApp.use(store).use(router).mount('#main-warp')
