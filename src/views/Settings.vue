<template>
  <div class="wc-settings">
    <mt-header :title="$t('msg.settings')">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>

    <mt-cell is-link class="mt-20" :title="$t('msg.realName')" value="余伟"></mt-cell>
    <mt-cell is-link :title="$t('msg.gender')" value="男"></mt-cell>
    <mt-cell is-link :title="$t('msg.whatUp')" value="既然选择了远方"></mt-cell>

    <mt-radio
      :title="$t('msg.lang')"
      v-model="lang"
      :options="[{label: $t('msg.zh'), value: 'zh'}, {label: $t('msg.en'), value: 'en'}]">
    </mt-radio>

    <div class="logout-btn">
      <mt-button type="danger" size="large" @click.native="logout">{{ $t('msg.logout') }}</mt-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {MessageBox, Toast, Indicator} from 'mint-ui'

  export default {
    name: 'wc-settings',
    data() {
      return {
        lang: Vue.config.lang,
      }
    },
    watch: {
      lang: function (newLang) {
        this.$i18n.locale = newLang
        try {
          window.localStorage.lang = newLang
        } catch (e) {
          alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
        }
      }
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