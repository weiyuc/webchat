<template>
  <div class="text-icon" :style="{'width': width + 'px', 'height': height + 'px'}">
    <img v-if="showPhoto" :src="myself ? profilePhoto : userInfo.profilePhoto" :width="width" :height="height" />
    <span v-else :style="{'width': width + 'px', 'height': height + 'px', 'line-height': height + 'px', 'background-color': hashColor}">
      {{ textIcon }}
    </span>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {hashCode} from '../utils'
  export default {
    name: 'wc-profile-photo',
    data() {
      return {
        colors: [
          '#996633', '#993333', '#3399CC', '#336699', '#006699', '#0066CC', '#666699', '#9999CC', '#CCCC99'
        ]
      }
    },
    props: {
      width: {
        type: Number,
        default: 44
      },
      height: {
        type: Number,
        default: 44
      },
      username: {
        type: String
      },
      realName: {
        type: String
      },
      myself: {
        type: Boolean
      }
    },
    computed: {
      ...mapGetters({
        profilePhoto: 'profilePhoto',
        selfName: 'username',
        selfRealName: 'realName',
        friendsInfo: 'friendsInfo'
      }),
      userInfo() {
        return this.friendsInfo[this.username]
      },
      showPhoto() {
        if (this.myself) {
          return this.profilePhoto !== null && this.profilePhoto !== ''
        }
        return this.userInfo && this.userInfo.profilePhoto
      },
      textIcon() {
        if (this.myself) {
          if (this.selfRealName) {
            if (this.selfRealName.length === 1) {
              return this.selfRealName.toLocaleUpperCase()
            }
            return this.selfRealName.charAt(0).toLocaleUpperCase()
          }
          return this.selfName.charAt(0).toLocaleUpperCase()
        }

        if (this.realName) {
          if (this.realName.length === 1) {
            return this.realName.toLocaleUpperCase()
          }
          return this.realName.charAt(0).toLocaleUpperCase()
        }
        return this.username.charAt(0).toLocaleUpperCase()
      },
      hashColor() {
        let str
        if (this.myself) {
          str = this.selfName
        } else {
          str = this.username
        }
        const hash = Math.abs(hashCode(str))
        return this.colors[hash % this.colors.length]
      }
    }
  }
</script>
<style lang="scss">
  .text-icon {
    display: inline-block;
    span {
      display: inline-block;
      border-radius: 5px;
      text-align: center;
      vertical-align: middle;
      font-size: 18px;
      color: #fff;
    }
    img {
      border-radius: 5px;
    }
  }
</style>