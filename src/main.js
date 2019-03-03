// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import i18n from './i18n'

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import {Toast, Indicator, Lazyload} from 'mint-ui'

import axios from 'axios'

import './assets/css/style.scss'
import './assets/css/icon.css'
import store from './store'

Vue.use(Mint)

Vue.use(Lazyload, {
  preLoad: 1.3,
  attempt: 1
})

axios.interceptors.request.use(function (config) {
  config.headers.token = store.getters.token
  config.timeout = 6000
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (res) {
  if (res.data.responseCode !== 0) {
    Indicator.close()
    if (~[4003, 4004, 403].indexOf(res.data.responseCode)) {
      Toast(res.data.responseMsg)
      store.dispatch('logout').then(() => {
        router.push({path: '/login'})
      })
      return Promise.reject(res.data)
    }
    Toast(res.data.responseMsg)
    return Promise.reject(res.data)
  }
  return res.data
}, function (error) {
  console.error(error)
  Toast(i18n.t('msg.networkErr'))
  Indicator.close()
  return Promise.reject(error)
})

Vue.prototype.$http = axios

Vue.filter('time', timestamp => {
  return new Date(timestamp).toLocaleTimeString(Vue.config.lang)
})

Vue.config.productionTip = false

if (store.getters.token && store.getters.expiredTime > Date.now()) {
  store.dispatch('getContacts')
  store.dispatch('getUnReadMessages')
  store.dispatch('getUnreadFriendReq')
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {App}
})