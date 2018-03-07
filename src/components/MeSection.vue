<template>
  <div class="me-section">
    <mt-cell is-link :title="$t('msg.nearBy')">
      <span slot="icon" class="cell-icon">
          <img src="../assets/img/nearby.png"/>
      </span>
    </mt-cell>
    <mt-radio
      :title="$t('msg.lang')"
      v-model="lang"
      :options="[{label: $t('msg.zh'), value: 'zh'}, {label: $t('msg.en'), value: 'en'}]">
    </mt-radio>
  </div>
</template>
<script>
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
    }
  }
</script>
<style lang="scss">
  .cell-icon {
    display: inline-block;
    text-align: center;
    line-height: 25px;
    width: 30px;
    height: 30px;
    background-color: #F7BA2A;
    border-radius: 5px;
    margin-right: 10px;
  }
</style>