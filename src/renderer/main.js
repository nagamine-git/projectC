import Vue from 'vue'
import axios from 'axios'
import VueProgressBar from 'vue-progressbar'

import App from './App'
import router from './router'
import store from './store'

Vue.use(VueProgressBar, {
  color: 'rgb(0, 128, 238)',
  failedColor: 'red',
  thickness: '4px',
  height: '4px'
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
