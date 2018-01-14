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
      <mt-button style="margin-top: 10px" size="large" @click.native="reg" type="primary">
        {{$t('msg.register')}}
      </mt-button>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  import {mapGetters} from 'vuex'
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
    computed: {
      ...mapGetters({
        token: 'token',
        expiredTime: 'expiredTime'
      })
    },
    methods: {
      doCheck() {
        if (!$.trim(this.form.username)) {
          Toast("用户名不能为空")
          return false;
        }
        if (!$.trim(this.form.password)) {
          Toast("密码不能为空")
          return false;
        }
        return true;
      },
      login() {
        if (this.doCheck()) {
          this.$http.post('/apis/user/login', this.form).then(
            res => {
              this.$store.dispatch('login', res.responseData).then(
                () => {
                  this.$router.push({path: '/'})
                }
              )
            }
          );
        }
      },
      reg() {
        if (this.doCheck()) {
          setTimeout(() => {
            this.$router.push({path: '/'})
          }, 1500)
        }
      }
    }
  }
</script>