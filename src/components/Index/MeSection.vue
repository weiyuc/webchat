<template>
  <div class="me-section">
    <v-avatar :size="70" style="position: absolute; top: 80px; left: 50%;transform: translateX(-50%)">
      <wc-lazy-img :lazy-src="`/apis/user/getProfilePhoto/${username}?${profilePhotoVersion}`"></wc-lazy-img>
    </v-avatar>

    <!--<v-list>-->
      <!--<v-list-tile @click="$router.push({path: '/profiles'})">-->
        <!--<v-list-tile-avatar>-->
          <!--<v-avatar>-->
            <!--<wc-lazy-img :lazy-src="`/apis/user/getProfilePhoto/${username}?${profilePhotoVersion}`"></wc-lazy-img>-->
          <!--</v-avatar>-->
        <!--</v-list-tile-avatar>-->
        <!--<v-list-tile-content>-->
          <!--<v-list-tile-title>{{`Webchat ID:${username}`}}</v-list-tile-title>-->
        <!--</v-list-tile-content>-->
        <!--<v-list-tile-sub-title>{{realName}}</v-list-tile-sub-title>-->
      <!--</v-list-tile>-->
    <!--</v-list>-->


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
  import WcLazyImg from "../LazyImage";

  export default {
    components: {WcLazyImg}, name: "me-section",
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'username',
        'realName',
        'profilePhotoVersion'
      ])
    },
    methods: {
      comingSoon() {
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