<template>
  <div class="session-section">
    <div class="no-message" v-show="showNoMsg">
      <div class="lost-msg" v-show="lostConnect">
        <p>{{ $t('msg.lostConnect') }}</p>
      </div>
      <div class="on-data">
        <img src="../../assets/img/msg.png"/>
        <h4>{{ $t('msg.noMessage') }}</h4>
      </div>
    </div>
    <v-list v-show="!showNoMsg" two-line>
      <div class="lost-msg" v-show="lostConnect">
        <p>{{ $t('msg.lostConnect') }}</p>
      </div>
      <template
        v-for="session in sessions"
        v-if="session.lastMessage">
        <session
          :key="session.from"
          :session="session"
          :active="session.from === currentSession.from"
          @switch-session="switchSession">
        </session>
        <v-divider :inset="true"></v-divider>
      </template>
    </v-list>
  </div>
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
    height: 100%;
    .v-list {
      height: 100%;
      width: 100%;
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
      height: 100%;
      .on-data {
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
  }
</style>