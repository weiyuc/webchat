<template>
  <li class="session-list-item"
      :class="{ active: active }"
      @click="$emit('switch-session', session.from)">
    <h5 class="session-name">{{ session.remark || session.from }}</h5>
    <div class="session-time">
      {{ session.lastMessage.timestamp | time }}
    </div>
    <div class="session-last-message">
      {{ session.lastMessage.content }}
    </div>
    <mt-badge size="small" color="red" v-show="session.unreadMsgCount">
      {{ session.unreadMsgCount > 99 ? '99+' : session.unreadMsgCount}}
    </mt-badge>
  </li>
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
  .session-list-item {
    position: relative;
    > .mint-badge {
      position: absolute;
      top: 6px;
      right: 3px;
    }
  }
</style>
