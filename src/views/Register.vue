<template>
  <div class="wc-login">
    <mt-header fixed :title="$t('msg.register')"></mt-header>
    <div class="wc-logo">
      <img src="../assets/img/webchat.png"/>
    </div>
    <div class="wc-form">
      <mt-field :label="$t('msg.username')" :placeholder="$t('msg.unameMsg')" v-model="form.username"></mt-field>
      <mt-field :label="$t('msg.password')" :placeholder="$t('msg.passwdMsg')" type="password"
                v-model="form.password"></mt-field>
    </div>
    <div class="wc-button">
      <mt-button size="large" type="primary" @click.native="reg">{{$t('msg.register')}}</mt-button>
      <h3>{{ $t('msg.hasAccount') }}<router-link to="/login">{{ $t('msg.loginNow') }}</router-link></h3>
    </div>
  </div>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import api from '../api'

  export default {
    name: 'register',
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
      reg() {
        if (this.doCheck()) {
          let username = this.form.username
          let password = this.form.password
          Indicator.open()
          api.register({username, password}).then(
            () => {
              Indicator.close()
              Toast('注册成功')
              this.$nextTick(() => {
                Indicator.open()
                setTimeout(() => {
                  Indicator.close()
                  this.$router.push({path: '/login'})
                }, 1500)
              })
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
      margin: 20px 0 0 0;
      text-align: right;
      a {
        text-decoration: none;
      }
    }
  }
</style>