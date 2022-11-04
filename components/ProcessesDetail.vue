<template>
  <div class="flex-1 pr-2">
    <div class="bg-gray-50 px-4 py-6 sm:px-6 sm:rounded-t-lg">
      <div class="space-y-1 space-x-4 flex items-center">
        <Ui-Header>
          {{  process.name }}
        </Ui-Header>
        <Processes-Edit mode="edit" :process="process.id" ></Processes-Edit>
      </div>

      <div class="pt-4">
        <p class="text-sm text-gray-500">{{ process.description }}</p>
      </div>
    </div>

    <Stages-List :stages="process.stages"/>
    <div v-if="!hideWalks" class="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
      <Walks-List :process="process.id" ></Walks-List>
    </div>
  </div>

</template>
<script setup>
  const props = defineProps(['process', 'hideWalks'])
</script>