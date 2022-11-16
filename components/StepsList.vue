<template>
  <div v-if="steps.length == 0" class="flex flex-row gap-4 w-full pt-24 justify-center   ">
<!--    <div class="rotate-90">-->
<!--      <div class="animate-bounce">-->
<!--        <ArrowLongLeftIcon class="-rotate-90  h-5 w-5 text-gray-500" aria-hidden="true" />-->
<!--      </div>-->
<!--    </div>-->
<!--    <span class="italic text-gray-500">Add a video to get started</span>-->
  </div>
  <div v-else class="ml-8 px-4 sm:px-6 lg:px-8">
    <ui-slide-over ref="slideOver" @close="closeStepSlideOver">
      <Actions-List :key="activeStepActions.length" :walk="props.walk" :step="activeStepId" :actions="activeStepActions"/>
    </ui-slide-over>

    <div class="-my-2 -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-middle">
        <div class="shadow-sm ring-1 ring-black ring-opacity-5">
          <table class="min-w-full border-separate" style="border-spacing: 0">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"><span class="sr-only">Milestone</span></th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">Timing</th>
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">Description</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Observation</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Topics</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 text-lefts text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Actions</th>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"><span class="sr-only">Edit</span></th>
            </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(step, id) in filteredSteps" :key="step.id" :class="id % 2 === 0 ? undefined : 'bg-gray-50'">
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50" align="center">
                  <StarIcon v-if="step.milestone" class="border-transparent text-indigo-500 h-5 w-5" aria-hidden="true" />
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
                  <Topic-Detail v-for="topic in step.topics" :key="topic" :topic="topic"/>
                </td>
                <td class="whitespace text-center px-2 py-4 text-sm text-gray-500">
                  <Ui-Button @click="openStepSlideOver(step.id, step.actions)">
                    {{ step.actions.length }}
                  </Ui-Button>
                </td>
                <td class="relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-2">
                  <Ui-Button-Icon :icon=true :light="true" @click="emit('editStep', step.id)">
                    <PencilSquareIcon class="h-5 w-5 fill-gray-500 hover:fill-indigo-500 text-transparent" aria-hidden="true" />
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
const loading = ref(true)
// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel
let StepsActionRealtimeChannel = RealtimeChannel

const props = defineProps(['walk'])

const emit = defineEmits(['editStep', 'seekVideoTime'])


let activeStepId = ref(null)


// Load the Steps
const steps = ref([])
async function getSteps(id) {
  try {
    let { data, error, status } = await client
        .from('steps')
        .select( 'id, timing, walk, description, observation, rating, topics, milestone, actions(id, created_at, assigned_to, act_by, description)')
        .eq('walk', id)
        .order('timing', { ascending: true })
    if (error && status !== 406) throw error
    if (data) {
      steps.value = data
    }
  } catch (error) {
    alert(error.message)
  } finally {}
}

getSteps(props.walk)

const activeStepActions = computed(() => {
  const actions = steps.value.filter(x => x.id === activeStepId.value)
  console.log(actions)
  return actions[0].actions
});


const filteredSteps = computed(() => {
  // steps.value.sort((a, b) => a.distance - b.distance)

  // const onlyMilestones = steps.value.filter(x => x.milestone)

  return steps.value
});

function readableTime(time) {
  // To convert seconds to time
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  function convertMsToTime(secs) {
    if(!secs) return '00:00:00.000'
    let milliseconds = (secs.toFixed(3).toString()).split('.', 2);
    let milli = milliseconds[1]
    let seconds = Math.floor(secs)
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;


    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
        seconds)}.${milli}`;
  }

  return convertMsToTime(time);
}


const slideOver = ref('slideOver')



function closeStepSlideOver() {

}

function openStepSlideOver(stepId, stepActions) {
  activeStepId.value = stepId
  activeStepActions.value = stepActions
  slideOver.value.open()
}


onMounted(async () => {
  loading.value = true
  // Subscribe to changes of Steps
  realtimeChannel = client
      .channel('steps')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'steps', filter: `walk=eq.${props.walk}` },
          data => {
            console.log('change')
            getSteps(props.walk)

          })
      .subscribe()
  loading.value = false

  StepsActionRealtimeChannel = client
      .channel('steps_actions')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'steps_actions', filter: `walk_id=eq.${props.walk}` },
          data => {
            console.log('change')
            getSteps(props.walk)
          })
      .subscribe()
  loading.value = false
})




onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  client.removeChannel(StepsActionRealtimeChannel)
})

</script>