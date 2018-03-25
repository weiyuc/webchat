<template>
  <div class="wc-session" @click="$emit('switch-session', session.from)">
    <mt-cell
            :title="session.remark || session.from"
            :label="session.lastMessage.content"
            >
      <img src="../assets/img/webchat.png" width="44" height="44"/>
    </mt-cell>
    <span  class="time">{{ session.lastMessage.timestamp | time }}</span>
    <mt-badge size="small" color="red" v-show="session.unreadMsgCount">
      {{ session.unreadMsgCount > 99 ? '99+' : session.unreadMsgCount}}
    </mt-badge>
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
    .mint-cell {
      .mint-cell-value {
        position: absolute;
        left: 10px;
        top: 7px;
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
          top: 8px;
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
      right: 30px;
      top: 10px;
      font-size: 14px;
      color: #888;
    }
    .mint-badge {
      position: absolute;
      top: 5px;
      right: 8px;
    }
  }

</style>
