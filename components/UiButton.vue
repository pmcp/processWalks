<template>
  <button v-if="props.mode === 'edit'" class="relative inline-flex items-center px-1 py-1 text-sm font-medium text-gray-700 border-b-2 border-gray-50 hover:border-indigo-600 ">
    <slot />
  </button>
  <button v-else class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
    <slot />
  </button>
</template>
<script setup>
const props = defineProps(['mode'])

</script>