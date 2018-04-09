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
  </div>
</template>
<script>
  import {Toast, Indicator} from 'mint-ui'
  export default {
    name: 'wc-nearby-people',
    data() {
      return {
        position: {
          latitude: -1,
          longitude: -1
        }
      }
    },
    methods: {
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
          Indicator.close()
        }, () => {
          Toast('Unable to retrieve your location')
          Indicator.close()
        }, geo_options);
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