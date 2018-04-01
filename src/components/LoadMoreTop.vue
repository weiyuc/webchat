<template>
  <div class="mint-loadmore-top">
    <span v-show="topStatus === 'pull'">↓ {{ $t('msg.pullRefresh') }}</span>
    <span v-show="topStatus === 'drop'">↑ {{ $t('msg.releaseRefresh') }}</span>
    <span v-show="topStatus === 'loading'">
      <mt-spinner type="double-bounce" class="ico" color="#fff" :size="18"></mt-spinner>
      {{ $t('msg.loading') }}
    </span>
    <span v-show="topStatus === 'loaded'">
      <i class="icon icon-checkmark" style="color: #fff;font-size: 12px"></i>{{ $t('msg.loadSuccess') }}
    </span>
    <span v-show="topStatus === 'loadErr'"><i class="icon icon-cross"></i> {{ $t('msg.loadFail') }}</span>
  </div>
</template>
<script>
  export default {
    name: 'wc-load-more-top',
    props: {
      topStatus: {
        type: String,
        default: 'pull'
      }
    }
  }
</script>
<style lang="scss">
  .mint-loadmore-top {
    >span {
      position: relative;
      .ico {
        position: absolute;
        top: -1px;
        left: -27px;
      }
    }
  }
</style>