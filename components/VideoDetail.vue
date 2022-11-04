<template>
  <Video-Player :video="video"/>
  <Form-File-Upload @upload="updateWalk" />
</template>
<script setup>
const props = defineProps(['video'])
const emit = defineEmits(['upload'])
const updateWalk = (filePath) => {
  emit('upload', filePath)
}

</script>