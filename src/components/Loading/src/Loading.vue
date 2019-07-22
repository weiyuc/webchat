<template>
  <div v-show="show" class="wc-load-mark">
    <div class="wc-load-box">
      <div v-if="icon" class="wc-loading" style="left: 28%;top: 15%;">
        <v-icon style="font-size: 50px;color: #fff;">{{icon}}</v-icon>
      </div>
      <div v-else class="wc-loading">
        <v-progress-circular
                :size="36"
                :width="1.5"
                color="#fff"
                indeterminate
                style="position: absolute;left: -18px;top: -18px;"
        ></v-progress-circular>
      </div>
      <div class="wc-load-content"> {{tips}} </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        show: false
      }
    },
    props: {
      tips: String,
      icon: String
    },
    methods: {
      open() {
        this.show = true
      },
      close() {
        this.show = false
      }
    }
  }
</script>
<style>
  .wc-load-mark {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .wc-load-box {
    position: fixed;
    z-index: 3;
    width: 7.6em;
    min-height: 7.6em;
    top: 180px;
    left: 50%;
    margin-left: -3.8em;
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
    border-radius: 5px;
    color: #ffffff;
  }

  .wc-load-content {
    margin-top: 64%;
    font-size: 14px;
  }

  .wc-loading {
    position: absolute;
    width: 0;
    left: 50%;
    top: 38%;
  }
</style>
