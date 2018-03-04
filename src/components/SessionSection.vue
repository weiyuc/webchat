<template>
  <div class="session-section">
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
        'currentSession'
      ])
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
  .mint-search {
    height: 52px;
    width: 100%;
  }
</style>