import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import VueTippy from 'vue-tippy'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig)
app.use(VueTippy, { directive: 'tippy', component: 'tippy', })

app.mount('#app')
