<template>
  <div class="whitespace-nowrap px-2 py-1 text-center rounded-xl mb-2 text-xs font-medium bg-cyan-100 text-gray-900">{{ topic.name }}</div>
</template>
<script setup>
const props = defineProps(['topic'])
</script>