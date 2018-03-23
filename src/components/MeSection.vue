<template>
  <div class="me-section">
    <mt-cell class="mt-20" is-link :title="$t('msg.moments')">
      <span slot="icon" class="cell-icon moments icon icon-camera">
      </span>
    </mt-cell>
    <mt-cell is-link :title="$t('msg.nearBy')">
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
  export default {
    name: "me-section",
    data() {
      return {
      }
    }
  }
</script>
<style lang="scss">
  .me-section {
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