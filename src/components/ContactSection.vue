<template>
  <div class="contact-section" ref="contactSection">
    <mt-index-list :height="height">
      <mt-cell class="mt-20" :title="$t('msg.newFriends')" @click.native="toNewFriend">
        <span slot="icon" class="new-friend-icon cell-icon moments icon icon-user-plus">
        </span>
        <mt-badge size="small" color="red" v-show="unreadReqCount">
          {{ unreadReqCountFormat }}
        </mt-badge>
      </mt-cell>
      <mt-index-section v-for="(v, k, i) in contacts" :index="k" :key="i">
        <mt-cell v-for="(n, j) in v" :key="j" :title="n.remark || n.friendName" @click.native="toFriendCard(k, j)"></mt-cell>
      </mt-index-section>
    </mt-index-list>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'contact-section',
    data() {
      return  {
      }
    },
    computed: {
      ...mapGetters([
        'contacts',
        'unreadReqCount'
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
      toFriendCard(group, index) {
        this.$router.push({path: '/friendCard', query: {group, index}})
      }
    }
  }
</script>
<style lang="scss">
  .contact-section {
    .new-friend-icon {
      font-size: 24px;
      vertical-align: middle;
      color: #26a2ff;
    }
  }
</style>