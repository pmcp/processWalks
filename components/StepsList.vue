<template>
  <div v-if="!steps" class="flex flex-row gap-4 w-full pt-24 justify-center">
  </div>
  <div v-else class="pl-4">
    <div class=" overflow-x-auto shadow-xl rounded-lg mb-4">
      <div class="inline-block min-w-full  align-middle">
        <div class="shadow-sm ring-1 ring-black ring-opacity-5">
          <table class="min-w-full border-separate" style="border-spacing: 0">
            <thead class="bg-gray-50">
            <tr>
              <th v-if="layout !== 'videoFull'  && layout !== 'videoWide'" scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"><span class="sr-only">Milestone</span></th>
              <th  scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-2 lg:pl-2">Timing</th>
              <!-- <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-2 lg:pl-2">Timing</th> -->
              <th v-if="layout !== 'videoFull'" scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">Explanation</th>
              <th v-if="layout !== 'videoFull'  && layout !== 'videoWide'" scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                <span class="flex hover:underline cursor-pointer" @click="setOrderByRating">
                  <span>Rating</span>
                  <ChevronDownIcon v-if="orderByRating === null" class="h-5 w-5" aria-hidden="true" />
                  <ChevronUpIcon v-if="orderByRating === true" class="h-5 w-5" aria-hidden="true" />
                  <XMarkIcon v-if="orderByRating === false" class="pt-1 h-5 w-5" aria-hidden="true" />
                </span>
              </th>
              <th v-if="layout !== 'videoFull'  && layout !== 'videoWide'" scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Topics</th>
              <th  scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 text-lefts text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Actions</th>
              <th  scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 text-lefts text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Edit</th>
            </tr>
            </thead>

            <tbody  class="bg-white">
              <tr v-if="stepsOrdered.length < 1" >
                <th colspan="7" scope="colgroup" class="">
                  <div class="rounded-lg border-4 border-dashed border-gray-200 text-gray-400 font-medium p-40 text-center m-4" >
                    No Steps
                  </div>
                </th>
              </tr>
              <tr v-else v-for="(step, id) in stepsOrdered"  :class="id % 2 === 0 ? undefined : 'bg-gray-50'">
                <td v-if="layout !== 'videoFull' && layout !== 'videoWide'" class="align-top pt-6 whitespace-nowrap px-2 py-4 text-sm text-gray-50" align="center">
                  <StarIcon v-if="step.milestone" class="border-transparent text-rose-500 h-5 w-5" aria-hidden="true" />
                  <StarIcon v-else class="h-5 w-5 stroke-gray-500 text-transparent" aria-hidden="true" />
                </td>
                <td class="align-top whitespace-nowrap py-4 px-2 text-sm font-medium text-gray-900 ">
                  <Ui-Button :light="true" @click="emit('seekVideoTime', step.timing)" style="width:100%" class="flex items-center justify-center">
                    {{ readableTime(step.timing) }}
                  </Ui-Button>
                </td>
                <td v-if="layout !== 'videoFull'" class="align-top whitespace min-w-full px-3 py-4 text-sm text-gray-500 ">
                  <p class="font-bold">Description</p>
                  <p>{{ step.description }}</p>
                  <p class="font-bold mt-2">Observation</p>
                  <p>{{ step.observation }}</p>
                </td>

                <td v-if="layout !== 'videoFull'  && layout !== 'videoWide'" class="align-top whitespace px-3 py-4 text-sm text-gray-500">
                  <div class="flex justify-center items-center overflow-hidden rounded-lg">
                    <Step-Rating v-for="i in 9" :key="`rating-${i}`" :rating="step.rating" :block="i"  />
                  </div>
                </td>
                <td v-if="layout !== 'videoFull'  && layout !== 'videoWide'" class="align-top whitespace px-3 py-4 text-sm text-gray-500">
                  <Topic-Detail v-for="topic in step.topics" :key="topic" :topic="topic"/>
                </td>
                <td class="align-top whitespace text-center px-2 py-4 text-sm text-gray-500">
                  <Ui-Button :light="true" @click="emit( 'showActions', step)">
                    <span v-if="step.actions">{{ step.actions.length }}</span>
                    <span v-else>0</span>
                  </Ui-Button>
                </td>
                <td class="align-top relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-2">
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
import { StarIcon, PencilSquareIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { useSorted } from '@vueuse/core'
import {useReadableTime} from "../utils/readableTime";
const readableTime = useReadableTime
const props = defineProps(['steps', 'layout'])
const emit = defineEmits(['editStep', 'seekVideoTime', 'showActions'])

const orderByRating = ref(null)

function setOrderByRating() {
  if(orderByRating.value === false) return orderByRating.value = null
  if(orderByRating.value === true) return orderByRating.value = false
  if(orderByRating.value === null) return orderByRating.value = true
}


const stepsOrdered = computed(() => {
  if(!props.steps) return []
  let ordered = []
  if(orderByRating.value !== null) {
    if(orderByRating.value){
      ordered = useSorted(props.steps, (a, b) => a.rating - b.rating)
    } else {
      ordered = useSorted(props.steps, (a, b) => b.rating - a.rating)
    }
  } else {
    // if no order is selected, just do by timing
    ordered = useSorted(props.steps, (a, b) => a.timing - b.timing)
  }
  return ordered.value
})


</script>
