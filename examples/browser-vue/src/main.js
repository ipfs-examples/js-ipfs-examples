import { createApp } from 'vue'
import App from './App.vue'
import VueIpfs from './plugins/vue-ipfs.js'

// Load our IPFS plugin.
const app = createApp(App)
app.use(VueIpfs)
app.mount('#app')
