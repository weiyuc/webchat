<template>
  <div class="wc-friend-card">
    <mt-header :title="$t('msg.friendDetails')">
        <mt-button icon="back" slot="left" @click="back">{{ $t('msg.contact') }}</mt-button>
    </mt-header>
    <mt-cell style="min-height: 60px;" isLink>
      <wc-profile-photo style="font-size: 20px" slot="icon" :width="50" :height="50" :photo="profilePhoto" :content="contact.remark || friendName">
      </wc-profile-photo>
      <div slot="title" class="info-title">
        <p>{{ nickname }}</p>
        <p>{{ remark }}</p>
      </div>
    </mt-cell>
    <mt-cell :title="$t('msg.setRemark')" isLink @click.native="setRemark" isLink>
    </mt-cell>
    <mt-cell :title="$t('msg.region')" value="Wuhan, Hubei">
    </mt-cell>
    <mt-button class="info-button" type="primary" size="large" @click="switchSession">{{ $t('msg.sendMsg') }}</mt-button>
    <mt-button class="info-button" type="danger" size="large" @click="deleteFriend">{{ $t('msg.deleteFriend') }}</mt-button>
  </div>
</template>
<script>
  import {MessageBox, Toast, Indicator} from 'mint-ui'
  import WcProfilePhoto from "../components/ProfilePhoto"
  import {mapGetters} from 'vuex'
  import * as types from '../store/mutation-types'

  export default {
    name: 'friend-card',
    components: {WcProfilePhoto},
    props: {
      friendName: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapGetters({
        friendsInfo: 'friendsInfo'
      }),
      contact() {
        return this.friendsInfo[this.friendName] || {}
      },
      nickname() {
        return 'Webchat ID: ' + this.friendName
      },
      remark() {
        return this.$t('msg.remark') + ': ' + (this.contact.remark || '')
      },
      profilePhoto() {
        return this.contact.profilePhoto || ''
      }
    },
    methods: {
      setRemark() {
        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel'),
          inputPlaceholder: this.contact.remark
        }
        MessageBox.close()
        this.$nextTick(() => {
          MessageBox.prompt(this.$t('msg.remark'), config).then(
            ({ value }) => {
              let remark = value
              let friendName = this.contact.friendName
              let group = this.group
              let index = this.index
              this.$store.dispatch('setRemark', {
                remark, friendName, group, index
              })
            },
            () => {
              //Do nothing
            }
          )
        })
      },
      switchSession () {
        let from = this.friendName
        let remark = this.contact.remark
        this.$store.dispatch('switchSession', {from, remark}).then(() => {
          this.$router.push({path: '/messageSection'})
        })
      },
      deleteFriend() {

        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel')
        }
        MessageBox.close()
        MessageBox.confirm(
          `${this.$t('msg.confirmDeleteFriend')} ${this.contact.remark || this.friendName}`,
          this.$t('msg.tips'),
          config).then(() => {
          Indicator.open()
          this.$store.dispatch('dealFriendReq',
            {
              friendName: this.friendName,
              status: 4
            }
          ).then(
            () => {
              Indicator.close()
              this.$nextTick(() => {
                this.$store.dispatch('getContacts')
                this.back()
              })
            }
          )
        }).catch(
          () => {
            //ignore
          }
        )

      },
      back() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    }
  }
</script>
<style lang="scss">
  .wc-friend-card {
    background-color: #f8f8f8;
    width: 100%;
    height: 100%;
    .mint-cell {
      margin-top: 20px;
    }
    .info-title {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      > p {
        margin: 0;
      }
    }
    .info-button {
      width: 80%;
      margin: 20px auto 0 auto;
    }
    .text-icon {
      span {
        font-size: 20px;
      }
    }
  }
</style>