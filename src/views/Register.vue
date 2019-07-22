<template>
  <div class="wc-register">
    <div class="wc-logo">
      <img src="../assets/img/logo.png"/>
    </div>
    <v-form
      ref="form"
      lazy-validation>
      <v-text-field
        v-model="form.username"
        :counter="13"
        :rules="rules.nameRule"
        :label="$t('msg.username')"
        :placeholder="$t('msg.unameMsg')"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.password"
        type="password"
        :counter="16"
        :rules="rules.pwdRule"
        :label="$t('msg.password')"
        :placeholder="$t('msg.passwdMsg')"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.confirmPassword"
        type="password"
        :counter="16"
        :rules="rules.confirmPwdRule"
        :label="$t('msg.confirmPassword')"
        :placeholder="$t('msg.confirmPasswordMsg')"
        required
      ></v-text-field>
    </v-form>

    <div class="wc-button">
      <v-btn color="primary" @click.native="reg">{{$t('msg.register')}}</v-btn>
      <h3>{{ $t('msg.hasAccount') }}<router-link to="/login">{{ $t('msg.loginNow') }}</router-link></h3>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    name: 'wc-register',
    data() {
      const vm = this
      return {
        form: {
          username: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
          nameRule: [
            v => !!v || '用户名不能为空',
            v => (/^[a-zA-Z][a-zA-Z0-9_]{5,12}$/.test(v) || '6-15位字母/字母数字组合')
          ],
          pwdRule: [
            v => !!v || '密码不能为空',
            v => (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(v) || '8-16位字母数字组合')
          ],
          confirmPwdRule: [
            v => !!v || '密码不能为空',
            v => (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(v) || '8-16位字母数字组合'),
            v => (vm.form.password === v || '两次密码不一致')
          ]
        }
      }
    },
    methods: {
      reg() {
        if (this.$refs.form.validate()) {
          let username = this.form.username
          let password = this.form.password
          this.$loading.open()
          api.register({username, password}).then(
            () => {
              this.$loading.close()
              this.$nextTick(() => {
                this.$loading.open({ tips: this.$t('msg.regSuccess'), icon: 'check' })
                setTimeout(() => {
                  this.$loading.close()
                  this.$router.push({path: '/login'})
                }, 1500)
              })
            }
          )
        }
      }
    }
  }
</script>