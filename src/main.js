// main.ts
import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Print from 'vue3-print-nb' 
import "./assets/main.css";
import Components from './components/components'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component) // element-plus icon
}
app.use(Print)
app.use(ElementPlus)
app.use(Components)
app.use(router)
app.mount('#app')