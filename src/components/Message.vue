<template>
  <li class="message-list-item">
    <h5 class="message-author-name" v-if="message.isMe">{{ $t('msg.me') }}</h5>
    <h5 class="message-author-name" v-else>{{ message.remark || message.from }}</h5>
    <div class="message-time">
      {{ message.timestamp | time }}
    </div>
    <div class="message-text">{{ message.content }}</div>
  </li>
</template>

<script>
  export default {
    name: 'Message',
    props: {
      message: Object
    }
  }
</script>
