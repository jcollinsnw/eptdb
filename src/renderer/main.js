import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Vuetify from 'vuetify'
import jsonQuery from 'json-query'
import 'vuetify/dist/vuetify.min.css'
import './assets/weatherIcons/css/weather-icons.min.css'
import config from './config.js'

var jq = function (arg, obj) {
  return jsonQuery(arg, {data: obj})
}

Object.defineProperty(Vue.prototype, '$jq', {value: jq})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.prototype.$config = config
Vue.config.productionTip = false

Vue.use(Vuetify)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
