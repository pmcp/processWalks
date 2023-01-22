<template>
  <div class="whitespace-nowrap px-2 py-1 text-center rounded-xl mb-2 text-xs font-medium bg-gray-200 text-gray-900">{{ persona.description }}</div>
</template>
<script setup>
const props = defineProps(['persona'])
</script>