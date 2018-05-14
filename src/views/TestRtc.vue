<template>
  <div id="container">
    <h1>Wave Recorder example</h1>
    <p>Before you enable monitoring, make sure to either plug in headphones or turn the volume down.</p>
    <p>This ogg opus implementation does not support more than 2 channels.</p>

    <h2>Options</h2>

    <div>
      <label>monitorGain</label>
      <input id="monitorGain" type="number" value="0" />
    </div>

    <div>
      <label>recordingGain</label>
      <input id="recordingGain" type="number" value="1" />
    </div>

    <div>
      <label>numberOfChannels</label>
      <input id="numberOfChannels" type="number" value="1" />
    </div>

    <div>
      <label>bitDepth</label>
      <input id="bitDepth" type="number" value="16" />
    </div>

    <button id="init">init recorder with options</button>

    <h2>Recorder Commands</h2>
    <button id="start" disabled>start</button>
    <button id="pause" disabled>pause</button>
    <button id="resume" disabled>resume</button>
    <button id="stopButton" disabled>stop</button>

    <h2>Recordings</h2>
    <ul id="recordingslist"></ul>

    <h2>Log</h2>
    <pre id="log"></pre>
  </div>
</template>
<script>

  import Recorder from 'opus-recorder'

  export default {
    name: 'test-rtc',
    data() {
      return {
        btnText: '按住说话'
      }
    },
    methods: {
    },
    mounted() {
      let monitorGain = document.getElementById('monitorGain')
      let recordingGain = document.getElementById('recordingGain')
      let numberOfChannels = document.getElementById('numberOfChannels')
      let bitDepth = document.getElementById('bitDepth')
      let init = document.getElementById('init')
      let start = document.getElementById('start')
      let pause = document.getElementById('pause')
      let resume = document.getElementById('resume')
      let stopButton = document.getElementById('stopButton')
      let recordingslist = document.getElementById('recordingslist')
      let log = document.getElementById('log')

      function screenLogger(text, data) {
        log.innerHTML += "\n" + text + " " + (data || '');
      }
      if (!Recorder.isRecordingSupported()) {
        screenLogger("Recording features are not supported in your browser.");
      } else {
        init.addEventListener( "click", function(){
          init.disabled = true;
          start.disabled = false;
          monitorGain.disabled = true;
          recordingGain.disabled = true;
          numberOfChannels.disabled = true;
          bitDepth.disabled = true;

          let recorder = new Recorder({
            monitorGain: parseInt(monitorGain.value, 10),
            recordingGain: parseInt(recordingGain.value, 10),
            numberOfChannels: parseInt(numberOfChannels.value, 10),
            wavBitDepth: parseInt(bitDepth.value,10),
            encoderPath: './static/js/encoderWorker.min.js'
          });
          pause.addEventListener( "click", function(){ recorder.pause(); });
          resume.addEventListener( "click", function(){ recorder.resume(); });
          stopButton.addEventListener( "click", function(){ recorder.stop(); });
          start.addEventListener( "click", function(){
            recorder.start().catch(function(e){
              screenLogger('Error encountered:', e.message );
            });
          });
          recorder.onstart = function(){
            screenLogger('Recorder is started');
            start.disabled = resume.disabled = true;
            pause.disabled = stopButton.disabled = false;
          };
          recorder.onstop = function(){
            screenLogger('Recorder is stopped');
            start.disabled = false;
            pause.disabled = resume.disabled = stopButton.disabled = true;
          };
          recorder.onpause = function(){
            screenLogger('Recorder is paused');
            pause.disabled = start.disabled = true;
            resume.disabled = stopButton.disabled = false;
          };
          recorder.onresume = function(){
            screenLogger('Recorder is resuming');
            start.disabled = resume.disabled = true;
            pause.disabled = stopButton.disabled = false;
          };
          recorder.onstreamerror = function(e){
            screenLogger('Error encountered: ' + e.message );
          };
          recorder.ondataavailable = function( typedArray ){
            console.log('ondataavailable')
            let dataBlob = new Blob( [typedArray], { type: 'audio/wav' } );
            let fileName = new Date().toISOString() + ".wav";
            let url = URL.createObjectURL( dataBlob );
            let audio = document.createElement('audio');
            audio.controls = true;
            audio.src = url;
            let link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.innerHTML = link.download;
            let li = document.createElement('li');
            li.appendChild(link);
            li.appendChild(audio);
            recordingslist.appendChild(li);
          }
        })
      }
    }
  }
</script>