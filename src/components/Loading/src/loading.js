import Vue from 'vue';
import loading from './Loading.vue'
import i18n from '../../../i18n'

const Loading = Vue.extend(loading);
let instance;

export default {
  open(options = {}) {
    if (!instance) {
      instance = new Loading({
        el: document.createElement('div')
      });
    }
    if (instance.show) return;
    instance.tips = options.tips || i18n.t('msg.loading');
    instance.icon = options.icon || '';
    document.body.appendChild(instance.$el);

    Vue.nextTick(() => {
      instance.show = true;
    });
  },

  close() {
    if (instance) {
      Vue.nextTick(() => {
        instance.show = false;
      });
    }
  }
};
