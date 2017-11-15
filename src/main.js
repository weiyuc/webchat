// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'

import VueI18n from 'vue-i18n'
import messages from './locales'

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import './assets/css/style.css'
import './assets/css/icon.css'
import store from './store'
import { getAllMessages } from './store/actions'

Vue.use(Mint);
Vue.use(VueI18n);

Vue.filter('time', timestamp => {
    return new Date(timestamp).toLocaleTimeString()
})

if (localStorage) {
    if (!localStorage.lang) {
        localStorage.lang = 'zh_cn';
    }
    Vue.config.lang = localStorage.lang;
} else {
    Vue.config.lang = 'zh_cn';
}


const i18n = new VueI18n({
    locale: Vue.config.lang,
    messages,
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {App}
})

getAllMessages(store)
