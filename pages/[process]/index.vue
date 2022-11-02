<template>
  <div class="container" >
    <process-walks :process="route.params.process" />
  </div>
</template>

<script setup>
const route = useRoute()
</script>