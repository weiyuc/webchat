<template>
  <mt-loadmore class="load-more" :top-method="loadUnread" @top-status-change="handleTopChange" ref="loadMore">
    <div slot="top" class="mint-loadmore-top">
      <span v-show="topStatus === 'pull'">↓ 下拉刷新</span>
      <span v-show="topStatus === 'drop'">↑ 释放刷新</span>
      <span v-show="topStatus === 'loading'">加载中...</span>
    </div>
    <div class="session-section">
      <div class="lost-msg" v-show="lostConnect">
        <p>{{ $t('msg.lostConnect') }}</p>
      </div>
      <div class="no-message" v-show="showNoMsg">{{ $t('msg.noMessage') }}</div>
        <ul class="session-list">
          <session
            v-for="session in sessions"
            v-if="session.lastMessage"
            :key="session.from"
            :session="session"
            :active="session.from === currentSession.from"
            @switch-session="switchSession">
          </session>
        </ul>
    </div>
  </mt-loadmore>
</template>
<script>
  import Session from './Session.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'SessionSection',
    data() {
      return {
        topStatus: ''
      }
    },
    components: {Session},
    computed: {
      ...mapGetters([
        'sessions',
        'currentSession',
        'lostConnect'
      ]),
      showNoMsg() {
        if (Object.keys(this.sessions).length === 0) {
          return true
        }
        for (let i in this.sessions) {
          if (this.sessions[i].lastMessage) {
            return false
          }
        }
        return true
      }
    },
    methods: {
      switchSession (from) {
        this.$store.dispatch('switchSession', {from}).then(() => {
          this.$router.push({path: '/messageSection'})
        })
      },
      handleTopChange(status) {
        this.topStatus = status
      },
      loadUnread() {
        setTimeout(() => {
          this.$refs.loadMore.onTopLoaded()
        }, 1500)
      }
    }
  }
</script>
<style lang="scss">
  .load-more {
    width: 100%;
    height: 100%;
    .mint-loadmore-top {
      background-color: #333333;
      color: #fff;
    }
    .mint-loadmore-content {
      width: 100%;
      height: 100%;
    }
  }
  .session-section {
    width: 100%;
    height: 100%;
    .session-list {
      margin: 0;
      padding: 0;
    }
    .lost-msg {
      width: 100%;
      height: 30px;
      background-color: #fdf6ec;
      color: #e6a23c;
      > p {
        margin: 0;
        padding: 5px 0;
        text-align: center;
      }
    }
    .no-message {
      padding-top: 20px;
      text-align: center;
    }
  }
</style>