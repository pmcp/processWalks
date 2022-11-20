<template>
  <Ui-Heading class="mb-4">
    <span class="pr-4">
      Processes
    </span>
    <Processes-Edit mode="add"></Processes-Edit>
  </Ui-Heading>
  <div v-if="processes?.length > 0" class="overflow-hidden bg-white shadow-xl sm:rounded-xl">
    <ul role="list" class="divide-y divide-gray-200 bg-rose-50">
      <li
          v-for="process of processes"
          :key="process.id"
          @click="open(process.id)"
          class="bg-white transition ease-in-out hover:-translate-y-1 hover:scale-20 hover:bg-rose-50 duration-300 hover:cursor-pointer"
      >
        <div class="flex items-center px-4 py-4 sm:px-6">
          <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div class="truncate">
              <div class="flex text-sm">
                <p class="truncate font-medium text-rose-600">{{ process.name }}</p>
              </div>
              <div class="mt-2 flex">
                <div class="flex items-center text-sm text-gray-500">
                  <p>{{ process.description }}</p>
                </div>
              </div>
            </div>

          </div>
          <div class="ml-5 flex-shrink-0">
            <ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    No processes yet
  </div>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const props = defineProps(['processes'])

const emit = defineEmits(['open'])
const open = (processId) => {
  emit( 'open', processId)
}
</script>