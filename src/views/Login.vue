<template>
  <div class="wc-login">
    <mt-header fixed title="webchat"></mt-header>
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
      <h3>还没账号?<router-link to="/Register">立即注册</router-link></h3>
    </div>
  </div>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import api from '../api'

  export default {
    name: 'login',
    data() {
      return {
        title: 'msg.login',
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      doCheck() {
        if (!$.trim(this.form.username)) {
          Toast("用户名不能为空")
          return false
        }
        if (!$.trim(this.form.password)) {
          Toast("密码不能为空")
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
              this.$store.dispatch('subscribe', res).then(() => {
                this.$store.dispatch('getContacts').then(
                  () => {
                    this.$store.dispatch('getUnReadMessages').then(
                      () => {
                        Indicator.close()
                        this.$router.push({path: '/'})
                      }
                    )
                  }
                )
              })
            },
            () => {
              Indicator.close()
              //ignore
            }
          )
        }
      },
      reg() {
        if (this.doCheck()) {
          let username = this.form.username
          let password = this.form.password
          Indicator.open()
          api.register({username, password}).then(
            () => {
              Indicator.close()
              Toast('注册成功')
            },
            () => {
              //Do nothing
            }
          )
        }
      }
    }
  }
</script>
<style lang="scss">
  .wc-button {
    > h3 {
      margin: 0;
      text-align: right;
    }
  }
</style>