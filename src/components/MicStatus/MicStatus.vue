<template>
  <div class="mic">
    <button id="btn-speak">{{ speakBtn.text1 }}</button>
    <div v-show="speakBtn.status" class="mic-status">
      <i :class="'icon icon-' + speakBtn.icon"></i>
      <p :style="speakBtn.cancel ? 'background-color: #AA0000' : ''">{{ speakBtn.text2 }}</p>
    </div>
  </div>
</template>
<style lang="scss">
  .mic {
    > button {
      outline: none;
      margin: 0;
      padding: 0;
      display: block;
      text-align: center;
      line-height: 30px;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 5px;
      user-select: none;
      -webkit-touch-callout: none;
      background-color: #fff;
    }
    .mic-status {
      top: 40%;
      left: 50%;
      position: fixed;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      box-sizing: border-box;
      text-align: center;
      padding: 25px 15px 15px 15px;
      width: 150px;
      height: 150px;
      i {
        margin: 0;
        font-size: 60px;
      }
      p {
        margin-top: 15px;
      }
    }
  }
</style>
<script>
  import Recorder from 'opus-recorder'
  import {Toast} from 'mint-ui'

  export default {
    name: 'wc-mic-status',
    data() {
      return {
        recorder: null,
        speakBtn: {
          status: false,
          cancel: false,
          lock: false,
          icon: 'mic',
          y: null,
          text1: '按住说话',
          text2: '手指上滑取消发送'
        },
        message: {
          start: 0,
          end: 0
        }
      }
    },
    methods: {
      onStart() {
        this.recorder.start()
        this.speakBtn.status = true
        this.speakBtn.cancel = false
        this.speakBtn.icon = 'mic'
        this.speakBtn.text1 = '松开发送'
        this.speakBtn.text2 = '手指上滑取消发送'
        this.message.start = new Date().getTime()
      },
      onSpeak() {
        this.speakBtn.cancel = false
        this.speakBtn.icon = 'mic'
        this.speakBtn.text1 = '松开发送'
        this.speakBtn.text2 = '手指上滑取消发送'
      },
      onCancel() {
        this.speakBtn.cancel = true
        this.speakBtn.icon = 'reply'
        this.speakBtn.text1 = '松开取消'
        this.speakBtn.text2 = '松开手指取消发送'
      },
      onSend() {
        this.message.end = new Date().getTime()
        const duration = (this.message.end - this.message.start) / 1000
        if (!this.speakBtn.cancel && duration < 1.5) {
          this.speakBtn.icon = 'warning'
          this.speakBtn.text2 = '说话时间太短'
          this.speakBtn.lock = true
          setTimeout(() => {
            this.recorder.stop()
            this.speakBtn.status = false
            this.speakBtn.icon = 'mic'
            this.speakBtn.text1 = '按住说话'
            this.speakBtn.text2 = '手指上滑取消发送'
            this.speakBtn.y = 0
            this.message.start = 0
            this.message.end = 0
            this.speakBtn.lock = false
          }, 0)
          return
        }
        this.recorder.stop()
        this.speakBtn.status = false
        this.speakBtn.text1 = '按住说话'
        this.speakBtn.text2 = '手指上滑取消发送'
        this.speakBtn.y = 0
      }
    },
    mounted() {
      this.recorder = new Recorder({
        encoderPath: './static/js/waveWorker.min.js'
      })

      const vm = this
      this.recorder.ondataavailable = function (data) {
        if (!vm.speakBtn.cancel) {
          const duration = (vm.message.end - vm.message.start) / 1000
          if (duration < 0.8) {
            return
          }
          const dataBlob = new Blob([data], {type: 'audio/wav'});
          const reader = new FileReader();
          reader.readAsDataURL(dataBlob);
          reader.onloadend = function () {
            const res = {
              duration: Math.ceil(duration),
              data: reader.result,
              type: 'media'
            }
            vm.$emit('onMsg', res)
          }
        }
      }

      let dom = document.getElementById('btn-speak')


      const startFun = function (event) {
        dom.style.backgroundColor = '#666'
        dom.style.color = '#fff'
        if (vm.speakBtn.lock) {
          console.log('start lock')
          return false
        }
        vm.onStart()
        vm.speakBtn.y = event.touches[0].clientY
      }


      const endFun = function () {
        dom.style.backgroundColor = '#fff'
        dom.style.color = '#000'
        if (vm.speakBtn.lock) {
          console.log('end lock')
          return false
        }
        vm.onSend()
      }

      const moveFun = function (event) {
        if (vm.speakBtn.lock) {
          console.log('move lock')
          return false
        }
        if (vm.speakBtn.status) {
          let nowY = event.touches[0].clientY
          let disY = vm.speakBtn.y - nowY
          if (disY >= 80) {
            vm.onCancel()
          } else {
            if (vm.speakBtn.cancel) {
              vm.onSpeak()
            }
          }
        }
      }
      dom.ontouchstart = startFun
      dom.ontouchend = endFun
      document.ontouchmove = moveFun

      dom.mousedown = startFun
      dom.mouseup = endFun
      document.mousemove = moveFun
    }
  }
</script>