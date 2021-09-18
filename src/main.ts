import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import io, { Socket } from 'socket.io-client'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $socket: Socket // replace it with the right type
    }
}

const app = createApp(App)

const socket = io('http://localhost:5000')

app.config.globalProperties.$socket = socket
app.use(router).mount('#app')
