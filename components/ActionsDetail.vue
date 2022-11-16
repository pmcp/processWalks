<template>
  <div class="mt-6 overflow-hidden bg-white shadow sm:rounded-md ">
    <a href="#" class="block hover:bg-gray-50">
      <div class="px-4 py-4 sm:px-6">
        <div class="mt-2 sm:flex sm:justify-between mb-8">
          <div class="flex flex-col">
            <p class="flex items-center text-sm text-gray-500">
              <UsersIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              Assigned to {{ action.assigned_to }}
            </p>
            <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <CalendarIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              <time :datetime="action.act_by">To finish by {{ action.act_by }}</time>
            </p>
          </div>
          <Actions-Edit ref="addEditAction" :step="props.step" :walk="props.walk" :action="action"/>
        </div>
        <div class="flex items-center justify-between">
          <p class=" text-sm  text-gray-600">{{ action.description }}</p>
        </div>
      </div>
    </a>
  </div>
</template>


<script setup>
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/vue/20/solid'
const props = defineProps(['action'])
</script>