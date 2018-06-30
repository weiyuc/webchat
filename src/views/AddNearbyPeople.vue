<template>
  <transition name="fade">
    <div class="add-nearby">
      <mt-header fixed :title="$t('msg.nearBy')">
        <a href="javascript:;" slot="left" @click="back">
          <mt-button icon="back">{{$t('msg.back')}}</mt-button>
        </a>
      </mt-header>
      <div style="width: 100%;height: 40px"></div>
      <div class="user-info mt-20">
        <img width="82px" height="82px" style="border-radius: 5px" :src="`/apis/user/getProfilePhoto/${friendName}`" @error="onLoadError"/>
        <p>
          {{ friendName }}
        </p>
        <mt-button type="primary" size="small" @click="addFriend">{{ $t('msg.add') }}</mt-button>
      </div>

      <mt-popup v-model="popupVisible" :closeOnClickModal="false" position="top" class="mint-popup-2">
        <p>{{ $t('msg.reqSuccess') }}</p>
      </mt-popup>
    </div>
  </transition>
</template>
<script>
  import {MessageBox} from 'mint-ui'
  export default {
    name: 'wc-search',
    data() {
      return  {
        popupVisible: false,
        defaultImg: require('../assets/img/webchat.png')
      }
    },
    props: {
      friendName: {
        type: String
      }
    },
    methods: {
      addFriend() {
        this.$http.post('/apis/friend/addFriend', {
          friendName: this.friendName
        }).then(
          res => {
            if (res.responseCode === 0) {
              this.popupVisible = true
              setTimeout(() => {
                this.popupVisible = false
                this.$router.go(-1)
              }, 2000)
            }
          }
        )
      },
      back() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      },
      onLoadError(e) {
        e.target.src = this.defaultImg
        e.target.onerror = null
      }
    }
  }
</script>
<style lang="scss">
  .add-nearby {
    .line {
      height: 10px;
      margin-top: 48px;
      background-color: #d9d9d9;
    }
    .user-info {
      text-align: center;
      > p {
        font-size: 18px;
      }
      > button {
        width: 70%;
      }
    }

    .no-data {
      text-align: center;
      font-size: 14px;
    }

    .mint-popup-2 {
      width: 100%;
      height: 50px;
      text-align: center;
      background-color: rgba(0,0,0,.7);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      color: #fff;
    }

    .v-modal {
      background: transparent !important;
    }
  }
</style>