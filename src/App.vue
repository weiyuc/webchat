<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import store from './store'
  import {getMessages} from './store/actions'
  export default {
    name: 'app',
    created() {
      setInterval(() => {
        getMessages(store)
      }, 5000)
    }
  }
</script>
<style lang="scss">
  html {
    width: 100%;
    height: 100%;
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: "Microsoft Sans Serif";
      font-size: 14px;
      > #app {
        width: 100%;
        height: 100%;
        .wc-index {
          width: 100%;
          height: 100%;
          > .content {
            width: 100%;
            position: fixed;
            top: 40px;
            bottom: 55px;
            height: calc(100% - 95px);
            background-color: #f8f8f8;
            overflow-y: auto;
          }
          .mint-tab-item-label {
            position: relative;
            .mint-badge {
              position: absolute;
              top: -38px;
              right: 35px;
            }
          }
        }
        .wc-login {
          width: 100%;
          height: 100%;
          .wc-logo {
            padding-top: 60px;
            text-align: center;
          }
          .wc-form {
            margin: 20px auto 0 auto;
            width: 80%;

          }
          .wc-button {
            width: 80%;
            padding-top: 20px;
            margin: auto;
          }
        }
      }
    }
  }
</style>
