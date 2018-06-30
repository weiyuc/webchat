<template>
  <transition name="fade">
    <div class="wc-login">
      <mt-header fixed :title="$t('msg.login')"></mt-header>
      <div class="wc-logo">
        <img src="../assets/img/webchat.png"/>
      </div>
      <div class="wc-form">
        <mt-field :label="$t('msg.username')" :placeholder="$t('msg.unameMsg')" v-model="form.username"></mt-field>
        <mt-field :label="$t('msg.password')" :placeholder="$t('msg.passwdMsg')" type="password"
                  v-model="form.password"></mt-field>
      </div>
      <div class="wc-button">
        <mt-button size="large" type="primary" @click.native="login">{{$t('msg.login')}}</mt-button>
        <h3>{{ $t('msg.noAccount') }}<router-link to="/register">{{ $t('msg.registerNow') }}</router-link></h3>
      </div>
    </div>
  </transition>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import api from '../api'

  export default {
    name: 'login',
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      doCheck() {
        if (!this.form.username.trim()) {
          Toast(this.$t('msg.unameMsg'))
          return false
        }
        if (!this.form.password.trim()) {
          Toast(this.$t('msg.passwdMsg'))
          return false
        }
        return true
      },
      login() {
        if (this.doCheck()) {
          let username = this.form.username
          let password = this.form.password
          Indicator.open()
          this.$store.dispatch('login', {username, password}).then(
            (res) => {
              this.$store.dispatch('subscribe_msg', res).then(() => {
                Indicator.close()
                this.$store.dispatch('getContacts')
                this.$store.dispatch('getUnReadMessages')
                this.$store.dispatch('getUnreadFriendReq')
                this.$router.push({path: '/'})
              })
            },
            () => {
              Indicator.close()
            }
          )
        }
      }
    }
  }
</script>
<style lang="scss">
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