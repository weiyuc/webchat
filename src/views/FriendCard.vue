<template>
  <div class="wc-friend-card">
    <mt-header :title="$t('msg.friendDetails')">
        <mt-button icon="back" slot="left" @click="back">{{ $t('msg.contact') }}</mt-button>
    </mt-header>
    <mt-cell style="min-height: 60px;">
      <img slot="icon" src="../assets/img/webchat.png" width="50" height="50">
      <div slot="title" class="info-title">
        <p>{{ remark }}</p>
        <p>{{ nickname }}</p>
      </div>
    </mt-cell>
    <mt-cell :title="$t('msg.setRemark')" isLink @click.native="setRemark">
    </mt-cell>
    <mt-cell :title="$t('msg.region')" value="Wuhan, Hubei">
    </mt-cell>
    <mt-button class="info-button" type="primary" size="large" @click="switchSession">{{ $t('msg.sendMsg') }}</mt-button>
    <mt-button class="info-button" type="danger" size="large" @click="deleteFriend">{{ $t('msg.deleteFriend') }}</mt-button>
  </div>
</template>
<script>
  import {MessageBox, Toast, Indicator} from 'mint-ui'
  import {mapGetters} from 'vuex'
  import * as types from '../store/mutation-types'

  export default {
    name: 'friend-card',
    props: {
      group: {
        type: String,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    },
    computed: {
      ...mapGetters([
        'contacts'
      ]),
      remark() {
        let contacts = {}
        if (this.contacts && this.contacts[this.group]) {
          contacts = this.contacts[this.group][this.index]
        }
        return this.$t('msg.remark') + ': ' + (contacts.remark || '')

      },
      nickname() {
        let contacts = {}
        if (this.contacts && this.contacts[this.group]) {
          contacts = this.contacts[this.group][this.index]
        }
        return this.$t('msg.nickname') + ': ' + contacts.friendName
      }
    },
    methods: {
      setRemark() {
        if (!this.contacts || !this.contacts[this.group]) {
          return
        }
        let contacts = this.contacts[this.group][this.index]
        let config = {
          confirmButtonText: this.$t('msg.confirm'),
          cancelButtonText: this.$t('msg.cancel'),
          inputPlaceholder: contacts.remark
        }
        MessageBox.close()
        this.$nextTick(() => {
          MessageBox.prompt(this.$t('msg.remark'), config).then(
            ({ value }) => {
              let remark = value
              let friendName = contacts.friendName
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
        let contacts = {}
        if (this.contacts && this.contacts[this.group]) {
          contacts = this.contacts[this.group][this.index]
          let from = contacts.friendName
          let remark = contacts.remark
          this.$store.dispatch('switchSession', {from, remark}).then(() => {
            this.$router.push({path: '/messageSection'})
          })
        }
      },
      deleteFriend() {
        if (this.contacts && this.contacts[this.group]) {
          let contacts = this.contacts[this.group][this.index]

          let config = {
            confirmButtonText: this.$t('msg.confirm'),
            cancelButtonText: this.$t('msg.cancel')
          }
          MessageBox.close()
          MessageBox.confirm(
            `${this.$t('msg.confirmDeleteFriend')} ${contacts.remark || contacts.friendName}`,
            this.$t('msg.tips'),
            config).then(() => {
            Indicator.open()
            this.$store.dispatch('dealFriendReq',
              {
                friendName: contacts.friendName,
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
        }
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
  }
</style>