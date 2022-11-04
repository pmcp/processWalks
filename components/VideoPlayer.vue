<template>
  <client-only>
    <Player playsinline ref="player" @vPlaybackReady="onPlaybackReady" >
<!--        <Youtube videoId="DyTCOwB0DVw" />-->
      <Video>
        <source
            :data-src="video"
            type="video/mp4"
        />
      </Video>
      <DefaultUi>
        <Video-Controls/>
      </DefaultUi>
    </Player>
  </client-only>
</template>

<script setup>
import {Player, Video, DefaultUi, Youtube, usePlayer, usePlayerContext} from '@vime/vue-next';
// Default theme.
import '@vime/core/themes/default.css';
import UiButton from "./UiButton.vue";
// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

const props = defineProps(['video'])
console.log(props.video)


</script>


