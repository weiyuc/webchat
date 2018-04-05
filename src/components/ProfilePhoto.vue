<template>
  <div class="text-icon" :style="{'width': width + 'px', 'height': height + 'px'}">
    <img v-if="showPhoto" :src="myself ? profilePhoto : photo" :width="width" :height="height" />
    <span v-else :style="{'width': width + 'px', 'height': height + 'px', 'line-height': height + 'px'}">
      {{ textIcon }}
    </span>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'wc-profile-photo',
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
      background-color: #26a2ff;
      font-size: 18px;
      color: #fff;
    }
    img {
      border-radius: 5px;
    }
  }
</style>