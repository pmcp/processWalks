<template>
  <div v-if="!steps" class="flex flex-row gap-4 w-full pt-24 justify-center">
  </div>
  <div v-else class="px-4">
    <div class=" overflow-x-auto shadow-xl rounded-lg mb-4">
      <div class="inline-block min-w-full  align-middle">
        <div class="shadow-sm ring-1 ring-black ring-opacity-5">
          <table class="min-w-full border-separate" style="border-spacing: 0">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"><span class="sr-only">Milestone</span></th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">Timing</th>
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">Description</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Observation</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">rating</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Topics</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 text-lefts text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Actions</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"><span class="sr-only">Edit</span></th>
            </tr>
            </thead>

            <tbody  class="bg-white">
              <template v-if="stepsOrdered.length < 1">
                No steps
              </template>
              <tr v-else v-for="(step, id) in stepsOrdered"  :class="id % 2 === 0 ? undefined : 'bg-gray-50'">
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50" align="center">
                  <StarIcon v-if="step.milestone" class="border-transparent text-rose-500 h-5 w-5" aria-hidden="true" />
                  <StarIcon v-else class="h-5 w-5 stroke-gray-500 text-transparent" aria-hidden="true" />
                </td>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <Ui-Button :light="true" @click="emit('seekVideoTime', step.timing)">
                    {{ readableTime(step.timing) }}
                  </Ui-Button>
                </td>
                <td class="whitespace min-w-20 px-3 py-4 text-sm text-gray-500 ">{{ step.description }}</td>
                <td class="whitespace px-3 py-4 text-sm text-gray-500">{{ step.observation }}</td>
                <td class="whitespace px-3 py-4 text-sm text-gray-500">
                  <div class="flex justify-center items-center overflow-hidden rounded-lg">
                    <Step-Rating v-for="i in 11" :key="`rating-${i}`" :rating="step.rating" :block="i"  />
                  </div>
                </td>
                <td class="whitespace px-3 py-4 text-sm text-gray-500">
                  <Topic-Detail v-for="topic in step.topics" :key="topic" :topic="topic"/>
                </td>
                <td class="whitespace text-center px-2 py-4 text-sm text-gray-500">
                  <Ui-Button :light="true" @click="emit( 'showActions', step)">
                    <span v-if="step.actions">{{ step.actions.length }}</span>
                    <span v-else>0</span>
                  </Ui-Button>
                </td>
                <td class="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-2">
                  <Ui-Button-Icon :icon=true :light="true" @click="emit('editStep', step.id)">
                    <PencilSquareIcon class="h-5 w-5 fill-gray-500 hover:fill-rose-500 text-transparent" aria-hidden="true" />
                  </Ui-Button-Icon>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon, PencilSquareIcon } from '@heroicons/vue/20/solid'
import { useSorted } from '@vueuse/core'
import {useReadableTime} from "../utils/readableTime";
const readableTime = useReadableTime
const props = defineProps(['steps'])
const emit = defineEmits(['editStep', 'seekVideoTime', 'showActions'])


const stepsOrdered = computed(() => {
  if(!props.steps) return []
  const byTiming = useSorted(props.steps, (a, b) => a.timing - b.timing)
  return byTiming.value
})


</script>
