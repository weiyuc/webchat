<template>
  <div class="text-icon" :style="{'width': width + 'px', 'height': height + 'px'}">
    <img v-show="showPhoto" :src="myself ? profilePhoto : photo" :width="width" :height="height" />
    <span v-show="!showPhoto" :style="{'width': width + 'px', 'height': height + 'px', 'line-height': height + 'px', 'background-color': hashColor}">
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
      content: {
        type: String,
        default: ''
      },
      photo: {
        type: String,
        default: ''
      },
      myself: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'profilePhoto',
        'username',
        'realName'
      ]),
      showPhoto() {
        return this.myself ? this.profilePhoto !== null && this.profilePhoto !== '' : this.photo !== null && this.photo !== ''
      },
      textIcon() {
        if (this.myself) {
          if (this.realName) {
            if (this.realName.length === 1) {
              return this.realName.toLocaleUpperCase()
            }
            return this.realName.charAt(0).toLocaleUpperCase()
          }
          return this.username.charAt(0).toLocaleUpperCase()
        }
        if (this.content.length === 1) {
          return this.content.toLocaleUpperCase()
        }
        return this.content.charAt(0).toLocaleUpperCase()
      },
      hashColor() {
        let str
        if (this.myself) {
          if (this.realName) {
            str = this.realName
          } else {
            str = this.username
          }
        } else {
          str = this.content
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