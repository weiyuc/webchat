<template>
  <div class="wc-login">
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
    </v-form>

    <div class="wc-button">
      <v-btn color="primary" @click.native="login">{{$t('msg.login')}}</v-btn>
      <h3>{{ $t('msg.noAccount') }}<router-link to="/register">{{ $t('msg.registerNow') }}</router-link></h3>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    name: 'login',
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
          nameRule: [
            v => !!v || '用户名不能为空',
            v => (/^[a-zA-Z][a-zA-Z0-9_]{5,12}$/.test(v) || '6-15位字母/字母数字组合')
          ],
          pwdRule: [
            v => !!v || '密码不能为空',
            v => (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(v) || '8-16位字母数字组合')
          ]
        }
      }
    },
    methods: {
      doCheck() {
        return true
      },
      login() {
        if (this.$refs.form.validate()) {
          let username = this.form.username
          let password = this.form.password
          this.$loading.open()
          this.$store.dispatch('login', {username, password}).then(
            (res) => {
              this.$store.dispatch('subscribe_msg', res).then(() => {
                this.$loading.close()
                this.$store.dispatch('getContacts')
                this.$store.dispatch('getUnReadMessages')
                this.$store.dispatch('getUnreadFriendReq')
                this.$router.push({path: '/'})
              })
            },
            () => {
              this.$loading.close()
            }
          )
        }
      }
    }
  }
</script>