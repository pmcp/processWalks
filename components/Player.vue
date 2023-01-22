<template>
  <video-player
      class="video-player vjs-big-play-centered w-full"
      :src="video"
      crossorigin="anonymous"
      playsinline
      fluid
      controls
      :volume="0.6"
      :height="320"
      :playback-rates="[0.7, 1.0, 1.5, 2.0]"
      @mounted="handleMounted"
      @ready="handleEvent($event)"
      @timeupdate="$emit('timeupdate', player.currentTime())"
  />
  <!--      @play="handleEvent($event)"-->
  <!--      @pause="handleEvent($event)"-->
  <!--      @ended="handleEvent($event)"-->
  <!--      @loadeddata="handleEvent($event)"-->
  <!--      @waiting="handleEvent($event)"-->
  <!--      @playing="handleEvent($event)"-->
  <!--      @canplay="handleEvent($event)"-->
  <!--      @canplaythrough="handleEvent($event)"-->
</template>
<script lang="ts">
import { defineComponent, shallowRef } from 'vue'
import { VideoJsPlayer } from 'video.js'
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
export default defineComponent({
  name: 'Video Player',
  title: 'Video Player',
  components: {
    VideoPlayer
  },
  props: ['video', 'startTime'],
  emits: ['timeupdate'],

  setup() {
    const player = shallowRef<VideoJsPlayer>()
    const handleMounted = (payload: any) => player.value = payload.player
    const handleEvent = (log: any) => {}
    return { player, handleMounted, handleEvent }
  },
  watch: {
    startTime: function (newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.player.currentTime(newVal)
    },
    video: function (newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      // this.player.currentTime(newVal)
    }
  },

  mounted(){
    // if we have a start time, go there
    if(this.startTime) this.player.currentTime(this.startTime)
  },
  beforeDestroy() {
    if (this.player) this.player.dispose()
  }
})
</script>