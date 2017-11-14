// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueI18n from 'vue-i18n'
import messages from './locales'

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import './assets/css/icon.css'

Vue.use(Mint);
Vue.use(VueI18n);

if (!localStorage.lang) {
    localStorage.lang = 'zh_cn';
}

Vue.config.lang = localStorage.lang;
const i18n = new VueI18n({
    locale: Vue.config.lang,
    messages,
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    template: '<App/>',
    components: {App}
})
