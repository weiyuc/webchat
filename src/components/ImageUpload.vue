<template>
  <div class="wc-img-upload">
    <mt-header fixed title="photo">
      <mt-button icon="back" slot="left" @click.native="$emit('cancel')">{{ $t('msg.cancel') }}</mt-button>
      <mt-button icon="more" slot="right" @click.native="sheetVisible = true"></mt-button>
    </mt-header>
    <img v-show="imgData === ''" class="profile-photo" v-lazy="'/apis/user/getProfilePhoto/' + username" :width="canvasWidth/1.5" :height="canvasWidth/1.5"/>
    <input :id="inputId" @change="handleChange" style="display: none" type="file" accept="image/*"/>
    <canvas id="imgCanvas" :width="canvasWidth" :height="canvasHeight" v-show="imgData">
    </canvas>
    <div id="cut" class="cut"></div>
    <mt-actionsheet
      :actions="[
        {
          name: this.$t('msg.choosePhoto'),
          method: () => {
            this.handleSelect()
          }
        }
      ]"
      :cancelText="$t('msg.cancel')"
      v-model="sheetVisible">
    </mt-actionsheet>
    <div class="upload-btn" v-show="imgData !== ''">
      <mt-button type="primary" :disabled="btnDisabled" plain @click.native="handleUpload">{{ $t('msg.upload') }}</mt-button>
    </div>
  </div>
</template>
<script>
  import {uuidv4} from '../utils'
  import lrz from 'lrz'
  import {Toast, Indicator} from 'mint-ui'
  import {mapGetters} from 'vuex'

  export default {
    name: 'wc-img-upload',
    data() {
      return {
        inputId: uuidv4(),
        sheetVisible: false,
        imgData: '',
        canvasHeight: document.body.clientHeight - 160,
        canvasWidth: document.body.clientWidth,
        cutWidthAndHeight: 0,
        top: 0,
        left: 0,
        currentY: 0,
        currentX: 0,
        flag: false,
        ctx: null,
        btnDisabled: false
      }
    },
    computed: {
      ...mapGetters({
        username: 'username'
      }),
    },
    methods: {
      handleChange(e) {
        let file = e.target.files[0]
        if (!file) {
          return
        }
        let vm = this
        lrz(e.target.files[0], {quality: 0.1}).then(function (rst) {

          if (rst.base64.length > 1024 * 200) {
            vm.imgData = ''
            Toast(vm.$t('msg.photoTooLarge'))
            return
          }
          vm.imgData = rst.base64
          const img = new Image()
          img.src = vm.imgData
          img.onload = function () {

            const canvas = document.getElementById('imgCanvas')
            let ctx = null

            if (vm.ctx === null) {
              ctx = canvas.getContext('2d')
              vm.ctx = ctx
            } else {
              ctx = vm.ctx
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const r1 = img.width / img.height
            const r2 = canvas.clientWidth / canvas.clientHeight

            let width = 0, height = 0

            if (r1 > r2) {
              width = vm.canvasWidth
              height = img.height * (vm.canvasWidth / img.width)
            } else if (r1 === r2) {
              width = vm.canvasWidth
              height = vm.canvasHeight
            } else {
              height = vm.canvasHeight
              width = img.width * (vm.canvasHeight / img.height)
            }

            const x = (vm.canvasWidth - width) / 2
            vm.left = x
            const y = (vm.canvasHeight - height) / 2
            vm.top = y
            ctx.drawImage(img, x, y, width, height)

            const element = document.getElementById('cut')
            const cutWidthAndHeight = Math.min(width, height)
            vm.cutWidthAndHeight = cutWidthAndHeight

            element.style.width = cutWidthAndHeight - 2 + 'px'
            element.style.height = cutWidthAndHeight - 2 + 'px'
            element.style.top = (60 + y + (height - cutWidthAndHeight)/2) + 'px'
            element.style.left = (vm.canvasWidth - cutWidthAndHeight)/2 + 'px'

            let getCss = function (o, key) {
              return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key]
            }

            element.ontouchstart = function (event) {
              vm.flag = true
              vm.currentY = event.touches[0].clientY
              vm.currentX = event.touches[0].clientX
            }

            document.ontouchend = function () {
              vm.flag = false
              if (getCss(element, "top") !== "auto") {
                vm.top = getCss(element, "top")
              }
              if (getCss(element, "left") !== "auto") {
                vm.left = getCss(element, "left")
              }
            }

            document.ontouchmove = function (event) {
              if (vm.flag) {
                let nowY = event.touches[0].clientY
                let nowX = event.touches[0].clientX

                let disY = nowY - vm.currentY
                let disX = nowX - vm.currentX

                let newTop = parseInt(vm.top) + disY

                const minTop = 60 + y
                const maxTop = minTop + height - cutWidthAndHeight

                if (newTop < minTop) {
                  newTop = minTop
                } else if (newTop > maxTop) {
                  newTop = maxTop
                }
                element.style.top = newTop + "px"

                let newLeft = parseInt(vm.left) + disX
                const minLeft = x
                const maxLeft = (vm.canvasWidth - width)/2 + (width - cutWidthAndHeight)

                if (newLeft < minLeft) {
                  newLeft = minLeft
                } else if (newLeft > maxLeft) {
                  newLeft = maxLeft
                }
                element.style.left = newLeft + "px"

              }
            }
          }
        }).catch(function (err) {
          console.error(err)
          Toast(vm.$t('msg.readFail'))
        })
      },
      handleSelect() {
        document.getElementById(this.inputId).click()
      },
      handleUpload() {
        this.btnDisabled = true
        let top = parseInt(this.top)
        let left = parseInt(this.left)
        const imageData = this.ctx.getImageData(left, top - 60, this.cutWidthAndHeight, this.cutWidthAndHeight)
        const bufferCanvas = document.createElement('canvas')
        bufferCanvas.width = this.cutWidthAndHeight
        bufferCanvas.height = this.cutWidthAndHeight
        const bfx = bufferCanvas.getContext('2d')
        bfx.putImageData(imageData, 0, 0)
        const profilePhoto = bufferCanvas.toDataURL('image/jpeg', 0.7)
        this.$emit('onSelected', profilePhoto)
        this.btnDisabled = false
      }
    }
  }
</script>
<style lang="scss">
  .wc-img-upload {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333;
    .mint-header {
      background: #000;
    }
    canvas {
      margin-top: 60px;
    }
    .cut {
      border: 1px solid red;
      position: fixed;
    }
    .upload-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      text-align: center;
      width: 100%;
      height: 60px;
      button {
        width: 80%;
      }
    }
    .profile-photo {
      position: fixed;
      left: 16.5%;
      top: 130px;
      font-size: 30px;
      >span {
        font-size: 40px;
      }
    }
  }
</style>