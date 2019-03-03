<template>
  <transition name="fade">
    <div class="wc-settings">
      <mt-header fixed :title="$t('msg.settings')">
        <a href="javascript:;" slot="left" @click="back">
          <mt-button icon="back">{{$t('msg.back')}}</mt-button>
        </a>
      </mt-header>

      <div style="width: 100%;height: 40px"></div>

      <mt-radio class="mt-20"
        :title="$t('msg.lang')"
        v-model="lang"
        :options="[{label: $t('msg.zh'), value: 'zh'}, {label: $t('msg.en'), value: 'en'}]">
      </mt-radio>

      <div class="logout-btn">
        <mt-button type="danger" size="large" @click.native="logout">{{ $t('msg.logout') }}</mt-button>
      </div>
    </div>
  </transition>
</template>
<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import {MessageBox, Toast, Indicator} from 'mint-ui'

  export default {
    name: 'wc-settings',
    data() {
      return {
        lang: null,
      }
    },
    computed: {
      ...mapGetters([
        'isAlertTips'
      ])
    },
    watch: {
      lang: function(newLang) {
        this.$i18n.locale = newLang
        Vue.config.lang = newLang
        try {
          window.localStorage.lang = newLang
        } catch (e) {
          if (!this.isAlertTips)
            alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.')
        }
      }
    },
    created() {
      this.lang = Vue.config.lang
    },
    methods: {
      back() {
        this.$store.dispatch('clearSession').then(
          () => {
            window.history.length > 1
              ? this.$router.go(-1)
              : this.$router.push('/')
          }
        )
      },
      logout() {
        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel')
        }
        MessageBox.close()
        MessageBox.confirm(
          `${this.$t('msg.confirmLogout')}`,
          this.$t('msg.tips'),
          config).then(() => {
          this.$store.dispatch('logout').then(
            () => {
              this.$router.push({path: '/login'})
            }
          )
        }).catch(
          () => {
          }
        )
      }
    }
  }
</script>
<style lang="scss">
  .wc-settings {
    .logout-btn {
      width: 80%;
      text-align: center;
      margin: 30px auto 0 auto;
    }
    .cell-icon {
      font-size: 24px;
      vertical-align: middle;
    }
  }
</style>