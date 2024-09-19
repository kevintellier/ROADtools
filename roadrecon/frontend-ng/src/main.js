import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import axios from './plugins/axios'

import './css/style.css'

const app = createApp(App)
app.use(router)
app.use(axios,{
    baseUrl: 'http://localhost:5000/'
})
app.mount('#app')
