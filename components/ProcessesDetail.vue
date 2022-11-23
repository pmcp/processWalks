<template>
  <div class="bg-gray-50 px-4 py-6 sm:px-6 sm:rounded-t-lg">
    <div class="space-y-1 space-x-4 flex items-center flex-row justify-between">
      <Ui-Heading>
        <div class="flex items-center">
          <span class="mr-4">{{  process.name }}</span>
          <Processes-Edit :process="process.id"/>
        </div>
      </Ui-Heading>
    </div>
    <div class="pt-4 flex flex-col gap-8">
      <p class="w-full text-sm text-gray-500">{{ process.description }}</p>
      <slot name="content"/>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps(['process'])
</script>