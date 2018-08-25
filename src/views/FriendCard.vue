<template>
  <transition name="fade">
    <div class="wc-friend-card">
      <mt-header fixed :title="$t('msg.friendDetails')">
          <mt-button icon="back" slot="left" @click="back">{{ $t('msg.contact') }}</mt-button>
      </mt-header>
      <div style="width: 100%;height: 40px"></div>
      <mt-cell class="mt-20" style="min-height: 60px;" isLink>
        <img v-lazy="'/apis/user/getProfilePhoto/' + friendName" width="50" height="50"/>
        <div slot="title" class="info-title">
          <p>{{ nickname }}</p>
          <p>{{ $t('msg.remark') + ': ' + remark }}</p>
        </div>
      </mt-cell>
      <mt-cell :title="$t('msg.setRemark')" isLink @click.native="setRemark" isLink>
      </mt-cell>
      <mt-cell :title="$t('msg.region')" value="Wuhan, Hubei">
      </mt-cell>
      <mt-button class="info-button" type="primary" size="large" @click="switchSession">{{ $t('msg.sendMsg') }}</mt-button>
      <mt-button class="info-button" type="danger" size="large" @click="deleteFriend">{{ $t('msg.deleteFriend') }}</mt-button>
    </div>
  </transition>
</template>
<script>
  import {MessageBox, Toast, Indicator} from 'mint-ui'
  import {mapGetters} from 'vuex'
  import * as types from '../store/mutation-types'

  export default {
    name: 'friend-card',
    data() {
      return {
        friendRemark: ''
      }
    },
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
        if (this.friendRemark) {
          return this.friendRemark
        }
        return this.friendsInfo[this.friendName] ? (this.friendsInfo[this.friendName].remark || '') : ''
      },
      profilePhoto() {
        let contact = this.friendsInfo[this.friendName] || {}
        return contact.profilePhoto || ''
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
              if (value && value.length > 20) {
                Toast(this.$t('msg.enterWith20'))
                return
              }
              let remark = value
              let friendName = this.friendName
              this.$store.dispatch('setRemark', {
                remark, friendName
              }).then(
                () => {
                  this.friendRemark = remark
                },
                () => {
                }
              )
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
              remark: this.contact.remark,
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