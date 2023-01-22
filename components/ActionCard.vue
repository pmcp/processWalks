<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg relative">
    <div class="flex justify-between">
      <div class="px-4 py-5 sm:px-6 ">
        <div class="flex flex-col">
          <StarIcon v-if="action.steps[0].milestone" class="pt-1 mb-4 mr-2 h-5 w-5 fill-cyan-500" aria-hidden="true" />
          <h3 class="text-md pb-1 font-medium leading-6 text-gray-900">{{ action.description }}</h3>
        </div>
        <div class="flex flex-row gap-2 pt-2 pb-4">
          <div class="flex items-center">
            <UserCircleIcon class="mt-1 h-5 w-5 fill-gray-500" aria-hidden="true" />
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              {{ action.assigned_to }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <CalendarIcon class="mt-1 h-5 w-5 fill-gray-500" aria-hidden="true" />
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              {{ action.act_by}}
            </p>
          </div>
        </div>


        <div class="flex gap-2">
          <span class="text-xs pt-1 w-20 uppercase">Topics</span>
          <div class="flex gap-x-2 flex-wrap">
            <Topic-Detail v-for="topic in action.steps[0].topics" :topic="topic"></Topic-Detail>
          </div>
        </div>

        <div class="flex gap-2">
          <span class="text-xs pt-1 w-20 uppercase ">Personas</span>
          <div class="flex gap-x-2 flex-wrap">
            <Personas-Detail v-for="persona in action.walk.personas" :persona="persona"></Personas-Detail>
          </div>
        </div>
      </div>
      <div class=" px-4  sm:px-6 flex-col ">
        <div class="flex justify-center items-center overflow-hidden rounded-lg h-20">
          <Step-Rating v-for="i in 9" :key="`rating-${i}`" :rating="action.steps[0].rating" :block="i"  />
        </div>

      </div>

      <slot name="cardButton"></slot>


    </div>


  </div>
</template>
<script setup>

import { UserCircleIcon, CalendarIcon, StarIcon } from '@heroicons/vue/20/solid'
const props = defineProps(['action'])

</script>