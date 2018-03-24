<template>
  <div class="show-success">
    <div class="mint-toast is-placemiddle" style="padding: 20px;">
      <i class="mint-toast-icon icon icon-wink" style="margin: 0;"></i>
      <span class="mint-toast-text" style="padding-top: 10px;">{{ message }}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'wc-show-success',
    props: {
      message: {
        type: String,
        required: false,
        default: ''
      }
    }
  }
</script>
<style lang="scss">
  .show-success {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
</style>