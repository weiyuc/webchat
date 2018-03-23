<template>
  <div class="wc-settings">
    <mt-header :title="$t('msg.settings')">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>

    <mt-radio
      class="mt20"
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
  export default {
    name: 'wc-settings',
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
      back() {
        this.$store.dispatch('clearSession').then(
          () => {
            window.history.length > 1
              ? this.$router.go(-1)
              : this.$router.push('/')
          }
        )
      }
    }
  }
</script>
<style lang="scss">
  .wd-settings {
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