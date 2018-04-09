<template>
  <div class="me-section">

    <mt-cell class="mt-20 me" is-link to="/profiles" :title="realName" :label="'Webchat ID: ' + username">
      <wc-profile-photo :myself="true"></wc-profile-photo>
    </mt-cell>

    <mt-cell class="mt-20" is-link :title="$t('msg.moments')" @click.native="comingSoon">
      <span slot="icon" class="cell-icon moments icon icon-camera">
      </span>
    </mt-cell>
    <mt-cell is-link :title="$t('msg.nearBy')" to="/NearbyPeople">
      <span slot="icon" class="cell-icon near-by icon icon-man-woman">
      </span>
    </mt-cell>
    <mt-cell class="mt-30" is-link to="/settings" :title="$t('msg.settings')">
      <span slot="icon"  class="cell-icon settings icon icon-cog">
      </span>
    </mt-cell>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import WcProfilePhoto from "./ProfilePhoto"
  import {Toast} from 'mint-ui'

  export default {
    name: "me-section",
    components: {WcProfilePhoto},
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'username',
        'realName'
      ])
    },
    methods: {
      comingSoon() {
        Toast(this.$t('msg.comingSoon'))
      }
    }
  }
</script>
<style lang="scss">
  .me-section {
    .me {
      height: 70px;
      .mint-cell-wrapper {
        height: 100%;
        position: relative;
        img {
          position: absolute;
          left: 10px;
          top: 13px;
        }
        .mint-cell-title {
          position: absolute;
          left: 70px;
          top: 15px;
          .mint-cell-label {
            color: #000;
            font-size: 14px;
            margin-top: 8px;
          }
        }
      }
    }
    .cell-icon {
      font-size: 24px;
      vertical-align: middle;
    }
    .moments {
      color: #F56C6C;
    }
    .near-by {
      color: #F7BA2A;
    }
    .settings {
      color: #409EFF;
    }
  }
</style>