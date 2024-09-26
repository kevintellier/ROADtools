import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import axios from './plugins/axios'
import PrimeVue from 'primevue/config';
import Noir from './presets/Noir.js';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import './css/style.css'

const app = createApp(App)
app.use(router)
app.use(axios,{
    baseUrl: 'http://localhost:5000/'
})
app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    }
});

//Components
app.component("DataTable",DataTable)
app.component("Column",Column)


app.mount('#app')
