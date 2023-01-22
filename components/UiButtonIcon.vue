<template>
  <button v-if="light" :disabled="disabled" class=" inline-flex items-center px-4 py-2 text-sm font-medium  text-gray-700 ">
    <slot />
  </button>
  <button v-else :disabled="disabled" class="inline-flex items-center justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:w-auto">
    <slot />
  </button>
</template>
<script setup>
const props = defineProps(['light', 'disabled'])

</script>