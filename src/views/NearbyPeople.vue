<template>
  <transition name="fade">
    <div class="nearby-people">
      <mt-header fixed :title="$t('msg.nearBy')">
        <a href="javascript:;" slot="left" @click="back">
          <mt-button icon="back">{{$t('msg.back')}}</mt-button>
        </a>
        <mt-button icon="more" slot="right" @click.native="sheetVisible = true"></mt-button>
      </mt-header>
      <div style="width: 100%;height: 40px"></div>
      <div class="nearby-people-list mt-20">
        <mt-cell v-for="(p, i) in nearbyPeoples" isLink :to="(friendsInfo.hasOwnProperty(p.username) ? '/friendCard' : '/AddNearbyPeople') + '?friendName=' + p.username" :key="i" :title="p.username" :label="formatDistance(p.distance)" @click.native="">
          <img v-lazy="'/apis/user/getProfilePhoto/' + p.username" width="35" height="35"/>
        </mt-cell>
        <div v-show="nearbyPeoples.length === 0" class="no-data">{{ $t('msg.noData') }}</div>
      </div>
      <mt-actionsheet :actions="[
          {
            name: this.$t('msg.clearLocation'),
            method: () => {
              this.handleClearLocation()
            }
          }
        ]"
        :cancelText="$t('msg.cancel')"
        v-model="sheetVisible">
      </mt-actionsheet>
    </div>
  </transition>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import {mapGetters} from 'vuex'
  import api from '../api'

  export default {
    name: 'wc-nearby-people',
    data() {
      return {
        position: {
          latitude: -1,
          longitude: -1
        },
        sheetVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'nearbyPeoples',
        'friendsInfo'
      ])
    },
    methods: {
      back() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      },
      getPosition() {
        const geo_options = {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: 10000
        }
        Indicator.open()
        let vm = this

        function success(position) {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          vm.position.longitude = longitude
          vm.position.latitude = latitude
          vm.getNearbyPeoples(longitude, latitude)
        }

        function error(err) {
          console.error(err)
          Toast('Unable to retrieve your location')
          Indicator.close()
        }

        navigator.geolocation.getCurrentPosition(success, error, geo_options)
      },
      getNearbyPeoples(x, y) {
        this.$store.dispatch('getNearbyPeoples', {x, y}).then(
          () => {
            Indicator.close()
          },
          () => {
            Indicator.close()
          }
        )
      },
      formatDistance(distance) {
        let d = distance.value
        let u = 'km'
        if (d < 1) {
          d = d * 1000
          u = 'm'
        }

        if ('zh' === this.$i18n.locale) {
          return d.toFixed(2) + u + '以内'
        }
        return 'Within: ' + d.toFixed(2) + u
      },
      handleClearLocation() {
        api.clearLocation((isOk) => {
          if (isOk) {
            this.back()
          }
        })
      }
    },
    mounted() {
      this.getPosition()
    }
  }
</script>
<style lang="scss">
  .nearby-people {
    .nearby-people-list {
      -webkit-overflow-scrolling: touch;
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
          top: 6px;
        }
      }
      .no-data {
        height: 40px;
        padding-top: 20px;
        text-align: center;
      }
    }
  }
</style>