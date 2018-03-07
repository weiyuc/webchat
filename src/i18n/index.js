import VueI18n from 'vue-i18n'
import Vue from 'vue'
import messages from '../locales'

Vue.use(VueI18n)

if (localStorage) {
  if (!localStorage.lang) {
    localStorage.lang = 'zh'
  }
  Vue.config.lang = localStorage.lang
} else {
  Vue.config.lang = 'zh'
}

const i18n = new VueI18n({
  locale: Vue.config.lang,
  messages,
})

export default i18n