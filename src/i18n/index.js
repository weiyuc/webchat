import VueI18n from 'vue-i18n'
import Vue from 'vue'
import messages from './locales'

Vue.use(VueI18n)

try {
  if (!localStorage.lang) {
    localStorage.setItem('lang', 'zh')
  }
  Vue.config.lang = localStorage.lang
} catch (e) {
  alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
  Vue.config.lang = 'zh'
}

const i18n = new VueI18n({
  locale: Vue.config.lang,
  messages,
})

export default i18n