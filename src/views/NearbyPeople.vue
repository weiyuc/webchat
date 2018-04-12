<template>
  <div class="nearby-people">
    <mt-header :title="$t('msg.nearBy')">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>
    <div class="nearby-people-list">
      <mt-cell  v-for="(p, i) in nearbyPeoples" isLink :to="(friendsInfo.hasOwnProperty(p.username) ? '/friendCard' : '/AddNearbyPeople') + '?friendName=' + p.username" :key="i" :title="p.username" :label="formatDistance(p.distance)" @click.native="">
        <wc-profile-photo :username="p.username" :width="35" :height="35">
        </wc-profile-photo>
      </mt-cell>
    </div>
  </div>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import {mapGetters} from 'vuex'
  import WcProfilePhoto from "../components/ProfilePhoto"

  export default {
    name: 'wc-nearby-people',
    components: {WcProfilePhoto},
    data() {
      return {
        position: {
          latitude: -1,
          longitude: -1
        }
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
          maximumAge: 30000,
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
    }
  }
</style>