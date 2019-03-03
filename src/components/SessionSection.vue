<template>
  <div class="session-section" :style="{'height': height + 'px'}">
    <mt-loadmore class="load-more" :top-method="loadUnread" @top-status-change="handleTopChange" ref="loadMore">
      <wc-load-more-top slot="top" :topStatus="topStatus"></wc-load-more-top>
      <ul class="session-list" :style="{'min-height': height + 'px'}">
        <div class="lost-msg" v-show="lostConnect">
          <p>{{ $t('msg.lostConnect') }}</p>
        </div>
        <div class="no-message" :style="{'height': height + 'px'}" v-show="showNoMsg">
          <div>
          <img src="../assets/img/msg.png"/>
            <h4>{{ $t('msg.noMessage') }}</h4>
          </div>
        </div>
        <session
                v-for="session in sessions"
                v-if="session.lastMessage"
                :key="session.from"
                :session="session"
                :active="session.from === currentSession.from"
                @switch-session="switchSession">
        </session>
      </ul>
    </mt-loadmore>
  </div>
</template>
<script>
  import Session from './Session.vue'
  import {mapGetters} from 'vuex'
  import WcLoadMoreTop from "./LoadMoreTop";

  export default {
    name: 'SessionSection',
    data() {
      return {
        topStatus: ''
      }
    },
    props: {
      height: {
        type: Number,
        default: 0
      }
    },
    components: {WcLoadMoreTop, Session},
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
        const start = Date.now()
        this.$store.dispatch('getUnReadMessages').then(
          (res) => {
            const costTime = Date.now() - start
            if (costTime < 2000) {
              setTimeout(() => {
                this.topStatus = res ? 'loaded' : 'loadErr'
                setTimeout(() => {
                  this.$refs['loadMore'].onTopLoaded()
                }, 500)
              }, 2000 - costTime)
              return
            }
            this.topStatus = res ? 'loaded' : 'loadErr'
            setTimeout(() => {
              this.$refs['loadMore'].onTopLoaded()
            }, 500)
          }
        )
      }
    }
  }
</script>
<style lang="scss">
  .session-section {
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .load-more {
      background-color: #000;
      .mint-loadmore-top {
        color: #fff;
        background-color: #000;
      }
      .mint-loadmore-content {
        background-color: #f8f8f8;
      }
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
        text-align: center;
        position: relative;
        div {
          position: absolute;
          width: 100%;
          top: calc(50% - 100px);
          left: 0;
        }
        h4 {
          margin: 0;
          color: #818181;
        }
      }
      @keyframes spin {
        0%   { transform: rotate(360deg); }
        100% { transform: rotate(0deg); }
      }
    }
  }
</style>