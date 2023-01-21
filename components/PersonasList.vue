<template>
  <div class="border-b border-gray-200 pb-5 z-0 mr-4">
    <h3 class="text-md font-medium leading-6">Personas</h3>
  </div>
  <ul role="list" class="divide-y divide-gray-200 ">
    <li v-for="(persona, key) in personas" :key="key" class="text-sm font-light flex py-4 mr-4">
      <p class="text-gray-900">{{ persona.description }}</p>
    </li>
  </ul>
</template>
<script setup>
  const props = defineProps(['personas'])
</script>