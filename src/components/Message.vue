<template>
  <li class="message-list-item">
    <div :class="'message-text ' + (message.isMe ? 'text-right' : 'text-left')">
      <svg v-show="loading" class="loading" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(325.811 25 25)">
          <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
        </path>
      </svg>
      <i v-show="isTimeout" @click="resend" style="color: #F56C6C" class="icon icon-notification loading"></i>
      <span v-if="message.content.duration" :style="'width: ' + (message.content.duration * 18 ) + 'px'">
        <span class="duration">{{ message.content.duration + "''"}} </span>
        <i class="icon icon-volume-medium"></i>
      </span>
      <font v-if="!message.content.duration">{{ message.content }}</font>
    </div>

    <wc-profile-photo :class="'user-icon ' + (message.isMe ? 'icon-right' : 'icon-left')" :myself="message.isMe" :username="session.from" :realName="session.remark">
    </wc-profile-photo>
  </li>
</template>

<script>
  import {mapGetters} from 'vuex'
  import WcProfilePhoto from "./ProfilePhoto";

  export default {
    name: 'Message',
    components: {WcProfilePhoto},
    computed: {
      ...mapGetters({
        session: 'currentSession',
        friendsInfo: 'friendsInfo'
      }),
      loading() {
        return this.message.isMe && !this.message.sent && !this.message.timeout
      },
      isTimeout() {
        return this.message.isMe && this.message.timeout
      },
      profilePhoto() {
        let info = this.friendsInfo[this.session.from]
        if (info) {
          return info.profilePhoto
        }
        return ''
      }
    },
    props: {
      message: Object
    },
    methods: {
      resend() {
        this.$store.dispatch('resend', this.message)
      }
    }
  }
</script>

<style lang="scss">
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
      >span {
        display: inline-block;
        max-width: 180px;
      }
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
      >span {
        text-align: right;
      }
      .duration {
        position: absolute;
        left: -25px;
      }
    }
    .text-right:before {
      right: -7px;
      border-left: 10px solid #62b900;
    }

    .text-left {
      float: left;
      margin-left: 78px;
      background: #fff;
      >span {
        text-align: left;
      }
      .duration {
        position: absolute;
        left: -35px;
        display: inline-block;
        width: 30px;
      }
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
      left: -25px;
    }
  }

</style>
