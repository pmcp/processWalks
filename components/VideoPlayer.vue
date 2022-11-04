<template>
  <client-only>
    <Player playsinline ref="player" @vPlaybackReady="onPlaybackReady" >
<!--        <Youtube videoId="DyTCOwB0DVw" />-->
      <Video poster="https://media-files.vidstack.io/poster.png">
        <source
            data-src="https://media-files.vidstack.io/720p.mp4"
            type="video/mp4"
        />
      </Video>
      <DefaultUi>
        <Video-Controls/>
      </DefaultUi>
    </Player>
  </client-only>
</template>





<script>
import {defineComponent, ref, watch} from 'vue';
import {Player, Video, DefaultUi, Youtube, usePlayer, usePlayerContext} from '@vime/vue-next';
// Default theme.
import '@vime/core/themes/default.css';
import UiButton from "./UiButton.vue";
// Optional light theme (extends default).
// import '@vime/core/themes/light.css';



export default defineComponent({
  components: {
    Player,
    Video,
    DefaultUi,
    Youtube,
  },
});
</script>


