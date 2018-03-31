<template>
  <li class="message-list-item">
    <div :class="'message-text ' + (message.isMe ? 'text-right' : 'text-left')">
      <img v-show="message.isMe && !message.sent" class="loading" src="../assets/img/loading.svg"/>
      {{ message.content }}

    </div>
    <img :class="'user-icon ' + (message.isMe ? 'icon-right' : 'icon-left')" src="../assets/img/webchat.png"/>
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

<style lang="scss">
  @keyframes load {
    0% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
    }
    25% {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      -o-transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -moz-transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
      -o-transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
    }
  }

  .message-list-item {
    position: relative;
    margin-top: 20px;
    min-height: 43px;
    overflow: hidden;
    .message-text {
      position: relative;
      width: auto;
      max-width: 65%;
      min-height: 27px;
      border-radius: 5px;
      line-height: 25px;
      font-size: 16px;
      text-align: left;
      padding: 8px;
      word-break: break-all;
    }

    .message-text:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;
      top: 10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
    .text-right {
      float: right;
      margin-right: 78px;
      background: #62b900;
    }
    .text-right:before {
      right: -7px;
      border-left: 10px solid #62b900;
    }

    .text-left {
      float: left;
      margin-left: 78px;
      background: #fff;
    }
    .text-left:before {
      left: -7px;
      border-right: 10px solid #fff;
    }

    .user-icon {
      width: 44px;
      height: 44px;
      border-radius: 5px;
    }

    .icon-right {
      position: absolute;
      top: 0;
      right: 20px;
    }

    .icon-left {
      position: absolute;
      top: 0;
      left: 20px;
    }
    .loading {
      position: absolute;
      top: calc(50% - 8px);
      width: 16px;
      height: 16px;
      left: -20px;
      animation: load 1s;
      -moz-animation: load 1s;
      -webkit-animation: load 1s;
      -o-animation: load 1s;
    }
  }

</style>
