<template>
  <div class="me-section">
    <mt-cell class="mt-30" is-link :title="$t('msg.moments')">
      <span slot="icon" class="cell-icon moments icon icon-camera">
      </span>
    </mt-cell>

    <mt-cell class="mt-30" is-link :title="$t('msg.nearBy')">
      <span slot="icon" class="cell-icon near-by icon icon-man-woman">
      </span>
    </mt-cell>

    <mt-cell class="mt-30" is-link :title="$t('msg.settings')">
      <span slot="icon" class="cell-icon settings icon icon-cog">
      </span>
    </mt-cell>

    <mt-radio
      :title="$t('msg.lang')"
      v-model="lang"
      :options="[{label: $t('msg.zh'), value: 'zh'}, {label: $t('msg.en'), value: 'en'}]">
    </mt-radio>

    <div class="logout-btn">
      <mt-button type="danger" size="large" @click.native="logout">退出</mt-button>
    </div>
  </div>
</template>
<script>
  import {MessageBox, Toast, Indicator} from 'mint-ui'

  export default {
    name: "me-section",
    data() {
      return {
        lang: window.localStorage ? window.localStorage.lang : 'zh',
      }
    },
    watch: {
      lang: function (newLang) {
        this.$i18n.locale = newLang
        if (window.localStorage) {
          window.localStorage.lang = newLang
        }
      }
    },
    methods: {
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
            //ignore
          }
        )
      }
    }
  }
</script>
<style lang="scss">
  .cell-icon {
    font-size: 24px;
    vertical-align: middle;
  }
  .moments {
    color: #F56C6C;
  }
  .near-by {
    color: #F7BA2A;
  }
  .settings {
    color: #409EFF;
  }
  .logout-btn {
    width: 90%;
    text-align: center;
    margin: 30px auto 0 auto;
  }
</style>