<template>
  <div class="mic">
    <button id="btn-speak">{{ speakBtn.text1 }}</button>
    <div v-show="speakBtn.status" class="mic-status">
      <i :class="'icon icon-' + (speakBtn.cancel ? 'reply' : 'mic')"></i>
      <p :style="speakBtn.cancel ? 'background-color: #AA0000' : ''">{{ speakBtn.text2 }}</p>
    </div>
  </div>
</template>
<style lang="scss">
  .mic {
    >button {
      display: block;
      text-align: center;
      line-height: 30px;
      width: 100%;
      height: 100%;
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
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        margin-top: 15px;
      }
    }
  }
</style>
<script>
  import Recorder from 'opus-recorder'

  export default {
    name: 'wc-mic-status',
    data() {
      return {
        recorder: null,
        speakBtn: {
          status: false,
          cancel: false,
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
        this.recorder.start().catch(function(e){
          console.error(e)
        })
        this.speakBtn.status = true
        this.speakBtn.cancel = false
        this.speakBtn.text1 = '松开发送'
        this.speakBtn.text2 = '手指上滑取消发送'
        this.message.start = new Date().getTime()
      },
      onSpeak() {
        this.speakBtn.status = true
        this.speakBtn.cancel = false
        this.speakBtn.text1 = '松开发送'
        this.speakBtn.text2 = '手指上滑取消发送'
      },
      onCancel() {
        this.speakBtn.cancel = true
        this.speakBtn.text1 = '松开取消'
        this.speakBtn.text2 = '松开手指取消发送'
      },
      onCanceled() {
        this.message.end = new Date().getTime()
        this.recorder.stop()
        this.speakBtn.status = false
        this.speakBtn.text1 = '按住说话'
        this.speakBtn.text2 = '手指上滑取消发送'
        this.speakBtn.y = 0
      }
    },
    mounted() {

      this.recorder = new Recorder({
        encoderPath: './static/js/encoderWorker.min.js'
      })

      const vm = this
      this.recorder.ondataavailable = function(data) {
        if (!vm.speakBtn.cancel) {
          const res = {
            duration: Math.floor((vm.message.end - vm.message.start) / 1000),
            data: data
          }
          vm.$emit('onMsg', res)
        }
      }

      let dom = document.getElementById('btn-speak')

      dom.ontouchstart = function (event) {
        vm.onStart()
        vm.speakBtn.y = event.touches[0].clientY
      }

      dom.ontouchend = function () {
        vm.onCanceled()
      }
      document.ontouchmove = function (event) {
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
    }
  }
</script>