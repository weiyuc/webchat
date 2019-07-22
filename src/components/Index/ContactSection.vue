<template>
  <div class="contact-section" ref="contactSection">
    <mt-index-list :height="height">
      <mt-cell class="mt-20 new-friend" :title="$t('msg.newFriends')" @click.native="toNewFriend">
        <span slot="icon" class="new-friend-icon cell-icon icon icon-user-plus">
        </span>
        <mt-badge size="small" color="red" v-show="unreadReqCount">
          {{ unreadReqCountFormat }}
        </mt-badge>
      </mt-cell>
      <mt-index-section class="contact" v-for="(v, k, i) in contacts" :index="k" :key="i">
        <mt-cell v-for="(n, j) in v" :key="j" :title="(friendsInfo[n.friendName] ? friendsInfo[n.friendName].remark : '') || n.friendName" @click.native="toFriendCard(n.friendName)">
          <img v-lazy="'/apis/user/getProfilePhoto/' + n.friendName" width="35" height="35"/>
        </mt-cell>
      </mt-index-section>
    </mt-index-list>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'contact-section',
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
    props: {
      height: Number
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
    .new-friend {
      .mint-badge {
        position: absolute;
        top: 16px;
        right: 32px;
      }
    }
    .new-friend-icon {
      font-size: 24px;
      vertical-align: middle;
      color: #26a2ff;
    }
    .contact {
      .mint-cell-wrapper {
        position: relative;
        .mint-cell-value {
          position: absolute;
          left: 10px;
          top: 6px;
        }
        .mint-cell-title {
          position: absolute;
          left: 60px;
          top: 13px;
        }
      }
    }
    .mint-indexlist {
      ul {
        -webkit-overflow-scrolling: touch;
        .mint-indexsection-index {
          padding: 3px 10px !important;
        }
      }
    }
  }
</style>