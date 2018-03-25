<template>
  <div class="wc-session" @click="$emit('switch-session', session.from)">
    <mt-cell-swipe
            :title="session.remark || session.from"
            :label="session.lastMessage.content"
            :right="[
              {
                content: 'Delete',
                style: { background: 'red', color: '#fff' },
                handler: () => this.$messagebox('delete')
              }
            ]"
            >
      <img src="../assets/img/webchat.png" width="44" height="44"/>
      <span  class="time">{{ session.lastMessage.timestamp | time }}</span>
      <mt-badge size="small" color="red" v-show="session.unreadMsgCount">
        {{ session.unreadMsgCount > 99 ? '99+' : session.unreadMsgCount}}
      </mt-badge>
    </mt-cell-swipe>
  </div>
</template>
<script>
  export default {
    name: 'Session',
    props: {
      session: Object,
      active: Boolean
    }
  }
</script>
<style lang="scss">
  .wc-session {
    position: relative;
    height: 60px;
    .mint-cell-swipe {
      .mint-cell-value {
        position: absolute;
        left: 10px;
        width: 100%;
        img {
          border-radius: 5px;
        }
      }
      > .mint-cell-wrapper {
        height: 60px !important;
        .mint-cell-title {
          position: absolute;
          left: 65px;
          height: 45px;
          .mint-cell-text {
            font-size: 16px;
          }
          .mint-cell-label {
            font-size: 14px;
            margin-top: 9px;
          }
        }
      }
    }
    .time {
      position: absolute;
      right: 40px;
      top: 5px;
      font-size: 14px;
    }
    .mint-badge {
      position: absolute;
      top: 0px;
      right: 20px;
    }
  }

</style>
