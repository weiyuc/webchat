<template>
  <div class="wc-register">
    <mt-header fixed :title="$t('msg.register')"></mt-header>
    <div class="wc-logo">
      <img src="../assets/img/webchat.png"/>
    </div>
    <div class="wc-form">
      <mt-field :label="$t('msg.username')" :placeholder="$t('msg.unameMsg')" v-model="form.username"></mt-field>
      <mt-field :label="$t('msg.password')" :placeholder="$t('msg.passwdMsg')" type="password"
                v-model="form.password"></mt-field>
      <mt-field :label="$t('msg.confirmPassword')" :placeholder="$t('msg.confirmPasswordMsg')" type="password"
                v-model="form.confirmPassword"></mt-field>
    </div>
    <div class="wc-button">
      <mt-button size="large" type="primary" @click.native="reg">{{$t('msg.register')}}</mt-button>
      <h3>{{ $t('msg.hasAccount') }}<router-link to="/login">{{ $t('msg.loginNow') }}</router-link></h3>
    </div>
    <wc-show-success v-show="showSuccess" :message="this.$t('msg.regSuccess')"></wc-show-success>
  </div>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import api from '../api'
  import WcShowSuccess from "../components/ShowSuccess/ShowSuccess";

  export default {
    name: 'wc-register',
    components: {WcShowSuccess},
    data() {
      return {
        form: {
          username: '',
          password: '',
          confirmPassword: ''
        },
        showSuccess: false
      }
    },
    methods: {
      doCheck() {
        if (!$.trim(this.form.username)) {
          Toast(this.$t('msg.unameMsg'))
          return false
        }
        if (!$.trim(this.form.password)) {
          Toast(this.$t('msg.passwdMsg'))
          return false
        }
        if (!$.trim(this.form.confirmPassword)) {
          Toast(this.$t('msg.passwdMsg'))
          return false
        }
        if (this.form.confirmPassword !== this.form.password) {
          Toast(this.$t('msg.twicePasswdNotSame'))
          return false
        }
        return true
      },
      reg() {
        if (this.doCheck()) {
          let username = this.form.username
          let password = this.form.password
          Indicator.open()
          api.register({username, password}).then(
            () => {
              Indicator.close()
              this.showSuccess = true
              setTimeout(() => {
                this.showSuccess = false
                this.$router.push({path: '/login'})
              }, 1500)
            }
          )
        }
      }
    }
  }
</script>
<style lang="scss">
  .wc-register {
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
      > h3 {
        margin: 20px 0 0 0;
        text-align: center;
        a {
          text-decoration: none;
        }
      }
    }
  }
</style>