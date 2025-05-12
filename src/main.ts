import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { addLog } from './store'

console.log = function (message: string, ...optionalParams: object[]) {
  addLog('info', message, optionalParams)
}

console.error = function (message: string, ...optionalParams: object[]) {
  addLog('error', message, optionalParams)
}

console.warn = function (message: string, ...optionalParams: object[]) {
  addLog('warning', message, optionalParams)
}

const app = createApp(App)

app.use(router)

app.mount('#app')
