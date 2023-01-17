<template>
  <div class="bg-gray-50 px-4 py-6 sm:px-6 sm:rounded-t-lg">
    <div class="flex flex-col h-full justify-between">
      <div class="flex items-center justify-between w-full">
        <span class="mr-4">{{  process.name }}</span>
        <Processes-Edit :process="process.id"/>
      </div>
      <p class="w-full text-sm text-gray-500 pb-5">{{ process.description }}</p>
      <slot name="content"/>
      <Ui-Button
          @click="open(process.id)"
          v-if="process.walks"
        :light="true" class="flex justify-between w-full">
        Walks: {{ process.walks.length }}
        <ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </Ui-Button>

    </div>
  </div>
</template>
<script setup>
  import { ChevronRightIcon } from '@heroicons/vue/20/solid'
  const props = defineProps(['process'])

  const emit = defineEmits(['open'])
  const open = (processId) => {
    emit( 'open', processId)
  }
</script>