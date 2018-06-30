<template>
  <transition name="fade">
    <div class="wc-register">
      <mt-header fixed :title="$t('msg.register')"></mt-header>
      <div class="wc-logo">
        <img src="../assets/img/webchat.png"/>
      </div>
      <div class="wc-form">
        <mt-field :state="faultStatus.username ? 'error' : ''" ref="username" :label="$t('msg.username')" :placeholder="$t('msg.unameMsg')" v-model="form.username"></mt-field>
        <mt-field :state="faultStatus.password ? 'error' : ''" ref="passwd1" :label="$t('msg.password')" :placeholder="$t('msg.passwdMsg')" type="password"
                  v-model="form.password"></mt-field>
        <mt-field :state="faultStatus.confirmPassword ? 'error' : ''" ref="passwd2" :label="$t('msg.confirmPassword')" :placeholder="$t('msg.confirmPasswordMsg')" type="password"
                  v-model="form.confirmPassword"></mt-field>
      </div>
      <div class="wc-button">
        <mt-button size="large" type="primary" @click.native="reg">{{$t('msg.register')}}</mt-button>
        <h3>{{ $t('msg.hasAccount') }}<router-link to="/login">{{ $t('msg.loginNow') }}</router-link></h3>
      </div>
      <wc-show-success v-show="showSuccess" :message="this.$t('msg.regSuccess')"></wc-show-success>
    </div>
  </transition>
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
        showSuccess: false,
        faultStatus: {
          username: false,
          password: false,
          confirmPassword: false
        }
      }
    },
    methods: {
      checkUsername() {
        if (!this.form.username.trim()) {
          Toast(this.$t('msg.unameMsg'))
          this.faultStatus.username = true
          return false
        }

        const firstCharPattern = /^[a-zA-Z]$/
        const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/

        if (!usernamePattern.test(this.form.username)) {
          this.faultStatus.username = true
          if (!firstCharPattern.test(this.form.username.substring(0, 1))) {
            Toast(this.$t('msg.firstCharMsg'))
            return false
          }
          let length = this.form.username.length
          if (length < 5 || length > 15) {
            Toast(this.$t('msg.usernameLengthMsg'))
            return false
          }
          Toast(this.$t('msg.usernameMsg'))
          return false
        }
        this.faultStatus.username = false
        return true
      },
      checkPassword(key) {
        if (!this.form[key].trim()) {
          Toast(this.$t('msg.passwdMsg'))
          this.faultStatus[key] = true
          return false
        }

        const firstCharPattern = /^[a-zA-Z]$/
        const passwordPattern = /^[a-zA-Z]\w{5,17}$/

        if (!passwordPattern.test(this.form[key])) {
          this.faultStatus[key] = true
          if (!firstCharPattern.test(this.form.password.substring(0, 1))) {
            Toast(this.$t('msg.firstCharMsg'))
            return false
          }
          let length = this.form[key].length
          if (length < 6 || length > 18) {
            Toast(this.$t('msg.passwordLengthMsg'))
            return false
          }
          Toast(this.$t('msg.usernameMsg'))
          return false
        }

        if (this.form.password !== this.form.confirmPassword) {
          if (key === 'confirmPassword' || (this.form.password !== '' && this.form.confirmPassword !== '')) {
            this.faultStatus.password = true
            this.faultStatus.confirmPassword = true
            Toast(this.$t('msg.twicePasswdNotSame'))
          }
          return false
        }

        if (this.form.password === this.form.confirmPassword) {
          this.faultStatus.password = false
          this.faultStatus.confirmPassword = false
        }

        this.faultStatus[key] = false
        return true
      },
      doCheck() {
        return this.checkUsername() && this.checkPassword('password') && this.checkPassword('confirmPassword')
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
    },
    mounted() {
      let usernameInput = this.$refs.username.$el.children[1].children[1].children[0]
      let passwdInput1 = this.$refs.passwd1.$el.children[1].children[1].children[0]
      let passwdInput2 = this.$refs.passwd2.$el.children[1].children[1].children[0]
      usernameInput.addEventListener('blur', () => {
        this.checkUsername()
      }, true)
      passwdInput1.addEventListener('blur', () => {
        this.checkPassword('password')
      }, true)
      passwdInput2.addEventListener('blur', () => {
        this.checkPassword('confirmPassword')
      }, true)

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