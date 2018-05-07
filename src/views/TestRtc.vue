<template>
  <div id="container">
    test web rtc

    <button @touchstart="startRecord" @touchend="stopRecord">{{ btnText }}</button>
  </div>
</template>
<script>
  export default {
    name: 'test-rtc',
    data() {
      return {
        recorder: null,
        mediaStream: null,
        recorderFile: null,
        stopRecordCallback: function () {
        },
        btnText: '按住说话'
      }
    },
    methods: {
      getUserMedia(callback) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
          || navigator.msGetUserMedia || window.getUserMedia
        const constraints = {audio: true}
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(constraints).then(
            stream => {
              callback(false, stream)
            },
            err => {
              console.error(err)
              callback(err)
            }
          )
        } else if (navigator.getUserMedia) {
          navigator.getUserMedia(constraints, stream => {
            callback(false, stream)
          }, err => {
            callback(err)
          })
        } else {
          callback(new Error('Not support userMedia'))
        }
      },
      closeStream(stream) {
        if (typeof stream.stop === 'function') {
          stream.stop();
        }
        else {
          let trackList = [stream.getAudioTracks(), stream.getVideoTracks()]

          for (let i = 0; i < trackList.length; i++) {
            let tracks = trackList[i];
            if (tracks && tracks.length > 0) {
              for (let j = 0; j < tracks.length; j++) {
                let track = tracks[j];
                if (typeof track.stop === 'function') {
                  track.stop();
                }
              }
            }
          }
        }
      },
      startRecord() {
        this.getUserMedia((err, stream) => {
          if (err) {
            throw err
          }
          this.recorder = new MediaRecorder(stream)
          this.mediaStream = stream
          let chunks = []
          this.recorder.ondataavailable = function (e) {
            chunks.push(e.data);
          }
          this.recorder.onstop = () => {
            this.recorderFile = new Blob(chunks, {type: this.recorder.mimeType})
            chunks = []
            if (null !== this.stopRecordCallback) {
              this.stopRecordCallback()
            }
          }
          this.recorder.start()
        })
      },
      stopRecord(callback) {
        this.stopRecordCallback = callback
        this.recorder.stop()
        this.closeStream(this.mediaStream);
      },
      playRecord() {
        let url = URL.createObjectURL(this.recorderFile)
        let dom = document.createElement('video')
        dom.controls = "controls"
        dom.src = url
        document.getElementById('container').appendChild(dom)
      }
    },
    created() {
      this.startRecord()
      setTimeout(() => {
        this.stopRecord(() => {
          this.playRecord()
        })
      }, 5000)
    }
  }
</script>