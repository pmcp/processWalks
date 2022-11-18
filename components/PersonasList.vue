<template>
  <div class="bg-white border-b border-gray-200 pb-5 z-0 mr-4">
    <h3 class="text-lg font-medium leading-6">Personas</h3>
  </div>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="(persona, key) in personas" :key="key" class="flex py-4 mr-4">
      <Personas-Detail :persona="persona" />
    </li>
  </ul>
</template>
<script setup>
  const props = defineProps(['personas'])

</script>