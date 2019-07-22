<template>
  <v-list-tile
    avatar
    @click="$emit('switch-session', session.from)">
    <v-list-tile-avatar>
      <img v-lazy="'/apis/user/getProfilePhoto/' + session.from"/>
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title>{{session.remark || session.from}}</v-list-tile-title>
      <v-list-tile-sub-title class="wc-sub-title">
        <span class='text--primary'>{{session.lastMessage.duration ? '[语音]': session.lastMessage.content}}</span>
        <span  class="time">{{ session.lastMessage.timestamp | time }}</span>
      </v-list-tile-sub-title>
      <v-badge>
        <template v-slot:badge>
          <span>{{ session.unreadMsgCount > 99 ? '99+' : session.unreadMsgCount}}</span>
        </template>
      </v-badge>
    </v-list-tile-content>
  </v-list-tile>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
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
<style lang="scss" scoped>
  .v-list__tile__content {
    position: relative;
    .v-badge {
      position: absolute;
      right: 24px;
      top: 12px;
    }
  }
  .wc-sub-title {
    display: flex;
    justify-content: space-between;
  }
</style>
