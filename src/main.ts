import './registerServiceWorker'
import router from './router'
// import store from './store'
import { createBootstrap } from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './assets/my.scss'
import { createApp } from 'vue'
import App from './App.vue'

// Vue.config.productionTip = false

// // Install BootstrapVue
// Vue.use(BootstrapVue)
// // Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)
// Vue.use(BootstrapVueIcons)
// Vue.use(FormInputPlugin)

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

const app = createApp(App)

app.use(createBootstrap())
app.use(router)
// app.use(store)

app.mount('#app');

