<template>
  <v-list-tile
    class="wc-session"
    avatar
    @click="$emit('switch-session', session.from)">
    <v-list-tile-avatar>
      <wc-lazy-img :lazy-src="`/apis/user/getProfilePhoto/${session.from}`">
      </wc-lazy-img>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>{{session.remark || session.from}}</v-list-tile-title>
      <v-list-tile-sub-title class="wc-sub-title">
        <span class='msg'>{{session.lastMessage.duration ? '[语音]': session.lastMessage.content}}</span>
        <span  class="time">{{ session.lastMessage.timestamp | time }}</span>
      </v-list-tile-sub-title>
      <v-badge color="primary" overlap>
        <template v-slot:badge>
          <span>{{ session.unreadMsgCount > 99 ? '99+' : session.unreadMsgCount}}</span>
        </template>
      </v-badge>
    </v-list-tile-content>
  </v-list-tile>
</template>
<script>
  import {mapGetters} from 'vuex'
  import WcLazyImg from "../LazyImage"

  export default {
    components: {WcLazyImg},
    name: 'Session',
    props: {
      session: Object,
      active: Boolean
    },
    computed: {
      ...mapGetters({
        friendsInfo: 'friendsInfo'
      }),
      profilePhoto() {
        let info = this.friendsInfo[this.session.from]
        if (info) {
          return info.profilePhoto
        }
        return ''
      }
    }
  }
</script>
<style lang="scss">
  .wc-session {
    .v-list__tile__content {
      position: relative;
      .v-badge {
        position: absolute;
        right: 10px;
        top: 12px;
      }
    }
    .wc-sub-title {
      display: flex;
      justify-content: space-between;
      .msg {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
