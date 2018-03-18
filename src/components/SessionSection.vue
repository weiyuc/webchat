<template>
  <div class="session-section">
    <div class="no-message" v-show="showNoMsg">{{ $t('msg.noMessage') }}</div>
    <div class="lost-msg" v-show="lostConnect">
      <p>{{ $t('msg.lostConnect') }}</p>
    </div>
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
</template>
<script>
  import Session from './Session.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'SessionSection',
    data() {
      return {
        searchValue: ''
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
        return Object.keys(this.sessions).length === 0
      }
    },
    methods: {
      switchSession (from) {
        this.$store.dispatch('switchSession', {from}).then(() => {
          this.$router.push({path: '/messageSection'})
        })
      }
    }
  }
</script>
<style lang="scss">
  .session-section {
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