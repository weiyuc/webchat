<template>
  <transition name="fade">
    <div class="wc-new-friend">
      <mt-header fixed :title="$t('msg.newFriends')">
        <router-link to="/" slot="left">
          <mt-button icon="back">{{ $t('msg.back') }}</mt-button>
        </router-link>
      </mt-header>
      <div style="width: 100%;height: 40px"></div>
      <div class="mint-searchbar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input @click="toSearch" readonly="true" type="search" :placeholder="$t('msg.search')" class="mint-searchbar-core"/>
        </div>
      </div>

      <p class="line">{{ $t('msg.friendReq') }}</p>
      <mt-cell v-for="(f, i) in requestContacts" :key="i" :title="f">
        <mt-button size="small" type="primary" @click="dealReq(f, 2)">{{ $t('msg.accept') }}</mt-button>
        <mt-button size="small" type="danger" @click="dealReq(f, 3)" style="margin-left: 10px;">{{ $t('msg.refuse') }}</mt-button>
      </mt-cell>
    </div>
  </transition>
</template>
<script>
  import WcSearch from './Search'
  import {Toast} from 'mint-ui'
  import {mapGetters} from 'vuex'

  export default {
    name: 'wc-new-friend',
    components: {WcSearch},
    computed: {
      ...mapGetters([
        'requestContacts'
      ])
    },
    methods: {
      toSearch() {
        this.$router.push({path: '/search'})
      },
      dealReq(friendName, status) {
        this.$store.dispatch('dealFriendReq', {friendName, status}).then(
          () => {
            if (status === 2) {
              Toast(this.$t('msg.addSuccess'))
              this.$store.dispatch('getContacts')
            } else {
              Toast(this.$t('msg.hasRefused'))
            }
          }
        )
      }
    }
  }
</script>
<style lang="scss" scoped>
  .wc-new-friend {
    .mint-search {
      height: 100% !important;
    }
    .line {
      margin: 0;
      padding: 20px;
      border-bottom: 1px solid #d9d9d9;
      text-align: center;
    }
  }
</style>