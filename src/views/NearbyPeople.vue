<template>
  <div class="nearby-people">
    <mt-header :title="$t('msg.nearBy')">
      <a href="javascript:;" slot="left" @click="back">
        <mt-button icon="back">{{$t('msg.back')}}</mt-button>
      </a>
    </mt-header>
    <div v-show="position.latitude !== -1">
      latitude: {{position.latitude}}
      longitude: {{position.longitude}}
    </div>
    <div v-for="p in nearbyPeoples">
      <p>{{ p.username }}</p>
    </div>
  </div>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  import {mapGetters} from 'vuex'

  export default {
    name: 'wc-nearby-people',
    data() {
      return {
        position: {
          latitude: -1,
          longitude: -1
        },
        nearbyPeoples: []
      }
    },
    methods: {
      ...mapGetters([
        'nearbyPeoples'
      ]),
      getPosition() {
        const geo_options = {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 3000
        }
        Indicator.open()
        let vm = this
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          vm.position.latitude = latitude
          vm.position.longitude = longitude
          vm.getNearbyPeoples(latitude, longitude)
        }, () => {
          Toast('Unable to retrieve your location')
          Indicator.close()
        }, geo_options)
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
      back() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    },
    mounted() {
      this.getPosition()
    }
  }
</script>
<style lang="scss">
  .nearby-people {

  }
</style>