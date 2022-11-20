<template>
  <div class="flex-1 pr-2">
    <div class="bg-gray-50 px-4 py-6 sm:px-6 sm:rounded-t-lg">
      <div class="space-y-1 space-x-4 flex items-center flex-row justify-between">
        <Ui-Header>
          <div class="flex items-center">
          <span class="mr-4">{{  process.name }}</span>
          </div>
        </Ui-Header>
      </div>
      <div class="pt-4">
        <p class="w-full text-sm text-gray-500">{{ process.description }}</p>
      </div>
    </div>
  </div>

</template>
<script setup>
  const props = defineProps(['process'])
</script>