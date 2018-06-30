<template>
  <transition name="fade">
    <div class="wc-search">
      <mt-search ref="search"
        :placeholder="searchText"
        :cancel-text="cancelText"
        :autofocus="true"
        @click.native="handleClick"
        v-model.trim="value"
        @keyup.enter.native="onSearch">
        <mt-cell
          v-if="value"
          :title="title"
          is-link
          @click.native="onSearch">
        </mt-cell>
      </mt-search>
      <div v-if="friendInfo !== null">
        <div class="line">
        </div>
        <div class="user-info">
          <img src="../assets/img/webchat.png"/>
          <p>
            {{ friendInfo.friendName || friendInfo.username }}
          </p>
          <mt-button v-if="friendInfo.friendName" type="primary" :disabled="true" size="small" @click="addFriend">{{ $t('msg.hasAdded') }}</mt-button>
          <mt-button v-else type="primary" size="small" @click="addFriend">{{ $t('msg.add') }}</mt-button>
        </div>
      </div>

      <div class="no-data" v-if="hasSearch && friendInfo === null">
        <div class="line">
        </div>
        <p>{{ $t('msg.userNotExist') }}</p>
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
        value: '',
        friendInfo: null,
        hasSearch: false,
        popupVisible: false
      }
    },
    computed: {
      title() {
        return this.$t('msg.search') + ': ' + this.value
      },
      cancelText() {
        return this.$t('msg.cancel')
      },
      searchText() {
        return this.$t('msg.search')
      }
    },
    watch: {
      value: function() {
        this.friendInfo = null
        this.hasSearch = false
      }
    },
    methods: {
      handleClick(e) {
        if (e.target.tagName.toUpperCase() === "A") {
          this.$router.go(-1)
        }
      },
      onSearch() {
        if (!this.value) {
          return
        }
        if (this.value === this.$store.getters.username) {
          MessageBox.close()
          this.$nextTick(() => {
            MessageBox.alert(
              this.$t('msg.cannotAddYourself'),
              this.$t('msg.tips'),
              {confirmButtonText: this.$t('msg.confirm')}
            )
          })
          return
        }
        this.$http.post('/apis/friend/searchFriend', {
          friendName: this.value
        }).then(
          res => {
            this.friendInfo = res.responseData
            this.hasSearch = true
          }
        )
      },
      addFriend() {
        this.$http.post('/apis/friend/addFriend', {
          friendName: this.value
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
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs['search'].$refs['input'].click()
      })
    }
  }
</script>
<style lang="scss">
  .wc-search {
    .mint-search {
      height: 52px !important;
    }
    .mint-search-list {
      height: 48px !important;
      padding-top: 52px !important;
    }
    .line {
      height: 10px;
      margin-top: 48px;
      background-color: #d9d9d9;
    }
    .user-info {
      text-align: center;
      margin-top: 20px;
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