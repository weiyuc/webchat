<template>
  <v-list class="contact-section" two-line>
    <v-subheader>{{$t('msg.newFriends')}}</v-subheader>
    <v-list-tile @click="toNewFriend" class="new-friend-item">
      <v-list-tile-avatar>
        <v-avatar :size="40" color="indigo">
          <v-icon dark>person_add</v-icon>
        </v-avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{$t('msg.newFriends')}}</v-list-tile-title>
      </v-list-tile-content>
      <v-badge overlap>
        <template v-if="unreadReqCount > 0" v-slot:badge>
          <span>{{unreadReqCountFormat}}</span>
        </template>
      </v-badge>
    </v-list-tile>
    <v-divider></v-divider>
    <template v-for="(v, k, i) in contacts" :index="k">
      <v-subheader :key="`s${i}`">{{k}}</v-subheader>
      <template v-for="(n, j) in v">
        <v-list-tile
          :key="`l${j}`"
          avatar
          @click="toFriendCard(n.friendName)">
          <v-list-tile-avatar>
            <wc-lazy-img
              :lazy-src="`/apis/user/getProfilePhoto/${n.friendName}`">
            </wc-lazy-img>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{(friendsInfo[n.friendName] ? friendsInfo[n.friendName].remark : '') || n.friendName}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <v-divider></v-divider>
    </template>
  </v-list>
</template>
<script>
  import {mapGetters} from 'vuex'
  import WcLazyImg from "../LazyImage";

  export default {
    components: {WcLazyImg}, name: 'contact-section',
    computed: {
      ...mapGetters([
        'contacts',
        'unreadReqCount',
        'friendsInfo'
      ]),
      unreadReqCountFormat() {
        return this.unreadReqCount > 99 ? '99+' : this.unreadReqCount
      }
    },
    methods: {
      toNewFriend() {
        this.$router.push({path: '/newFriend'})
      },
      toFriendCard(friendName) {
        this.$router.push({path: '/friendCard', query: {friendName}})
      }
    }
  }
</script>
<style lang="scss">
  .contact-section {
    width: 100%;
    height: 100%;
    .new-friend-item {
      position: relative;
      .v-badge {
        position: absolute;
        right: 24px;
        top: 15px;
      }
    }
  }
</style>