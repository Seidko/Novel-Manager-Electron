import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const MainApp = createApp(App)
MainApp.use(store).mount('#app')
