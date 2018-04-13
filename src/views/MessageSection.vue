<template>
  <div class="message">
    <mt-header fixed :title="session.remark || session.from">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>
    <div class="message-section">
      <ul class="message-list" ref="list">
        <message
          v-for="message in sortedMessages"
          :key="message.id"
          :message="message">
        </message>
      </ul>
    </div>
    <form action=".">
      <mt-field type="search" v-model="msg" id="msgInput" @keyup.enter.native="sendMessage" class="bottom-input">
        <mt-button type="primary" size="small" @click="sendMessage">{{$t('msg.send')}}</mt-button>
      </mt-field>
    </form>
  </div>
</template>

<script>
  import Message from '../components/Message.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'MessageSection',
    components: {Message},
    data() {
      return {
        msg: ''
      }
    },
    computed: {
      ...mapGetters({
        session: 'currentSession',
        messages: 'currentMessages'
      }),
      sortedMessages () {
        return this.messages
          .slice()
          .sort((a, b) => a.timestamp - b.timestamp)
      }
    },
    watch: {
      'session.lastMessage': function () {
        this.$nextTick(() => {
          const ul = this.$refs.list
          ul.scrollTop = ul.scrollHeight
        })
      }
    },
    methods: {
      sendMessage () {
        if (this.msg) {
          this.$store.dispatch('sendMessage', {
            content: this.msg,
            session: this.session
          }).then(() => {
            this.msg = ''
          }).catch((err) => {
            console.error(err)
          })
        }
      },
      back() {
        this.$store.dispatch('clearSession').then(
          () => {
            window.history.length > 1
              ? this.$router.go(-1)
              : this.$router.push('/')
          }
        )
      }
    },
    mounted() {
      if (!this.session || Object.keys(this.session).length === 0) {
        this.$router.push('/')
      }
    }
  }
</script>
<style lang="scss">
  .message {
    width: 100%;
    height: 100%;
    .message-section {
      position: fixed;
      top: 40px;
      height: calc(100% - 89px);
      max-height: calc(100% - 89px);
      width: 100%;
      .message-list {
        height: calc(100% - 20px);
        margin: 0;
        list-style: none;
        overflow-y: auto;
        padding: 0 0 20px 0;
        -webkit-overflow-scrolling: touch;
      }
      background: url("../assets/img/bg.png") no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
    }
    .bottom-input {
      width: 100%;
      position: fixed;
      bottom: 0;
    }
  }
</style>
