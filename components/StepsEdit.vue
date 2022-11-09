<template>
  <Ui-Button @click="startAddSteps">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New step at {{ walkTimeToStamp }}
  </Ui-Button>

  <Ui-Modal ref="addStepModal" @closed="cleanUp" @opened="prepare">
    <template v-slot:title>
      <Player :video="videoUrl" :startTime="videoTime"  ref="stepVideoPlayer" />
      <div class="flex flex-row justify-between mt-2">
        <Ui-Button :light="true" @click="$refs.stepVideoPlayer.player.currentTime(stepTiming)">Go to step ({{ stepTimeToStamp }})</Ui-Button>
        <Ui-Button :light="true" @click="setCurrentTime($refs.stepVideoPlayer.player.currentTime())">Save current time</Ui-Button>
      </div>
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addSteps"
          id="addSteps"
          :actions="false"
          @submit="submitAddStep"
      >
        <FormKit
            type="textarea"
            label="Description"
            name="description"
            help="What is happening in this step?"
        />
        <FormKit
            type="textarea"
            label="Observation"
            name="observation"
            help="What do you take away from this moment?"
        />
        <FormKit
            type="checkbox"
            label="Milestone"
            name="milestone"
            help="Is this an important moment in the walk?"
        />
        <FormKit
            type="rating"
            rating-icon="star"
            min="1"
            max="10"
            label="How do you rate the experience of this step?"
            name="rating"
            id="rating"
        />
        <div class="relative">
          <FormKit
              type="checkbox"
              label="Topics"
              name="topics"
              ref="topicsInput"
              :options="topics"
              help="Tags this walk with topics"
          />

          <Topics-Edit  mode="add" @added="addTopics"/>
        </div>
        <div  class="absolute right-6 bottom-0">
        <FormKit type="submit">
          <template v-if="props.mode === 'edit'">
            Save changes
          </template>
          <template v-else>
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Step
          </template>
        </FormKit>
        </div>
      </FormKit>

    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'

import { getNode } from '@formkit/core';

// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

const props = defineProps(['walk', 'mode', 'videoUrl', 'videoTime'])
const emit = defineEmits(['stopPlayer'])

const addStepModal = ref('addStepModal')
const loading = ref(true)

const stepTiming = ref(null)
const stepVideoPlayer = ref(null)

function setCurrentTime(val) {
  stepTiming.value = val
}

const mode = ref('add')

async function startAddSteps(id) {
  emit('stopPlayer')
  addStepModal.value.open()


  if(id) {
    mode.value = 'edit'
    await getStep(id)

  }
}

async function getStep(id) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('steps')
        .select('id, timing, description, observation, topics, rating, milestone')
        .eq('id', id)
        .single()

    if (error && status !== 406) throw error
    if (data) {

      // Set timing for video
      setCurrentTime(data.timing)
      stepVideoPlayer.value.player.currentTime(data.timing)

      // Fill Form
      getNode('addSteps').input({
        id,
        walk: data.walk,
        description: data.description,
        observation: data.observation,
        topics: data.topics,
        rating: data.rating,
        milestone: data.milestone
      }).then((data) => {
        // TODO add loading flow
        console.log('loaded data', data)
      })
    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}

async function submitAddStep (item) {
  console.log(item)
  const { error, data } = await client.from('steps')
      .upsert({
        id: item.id,
        walk: props.walk,
        timing: stepTiming.value,
        description: item.description,
        observation: item.observation,
        topics: item.topics,
        rating: item.rating,
        milestone: item.milestone
      })
      .select('id, timing, description, observation, topics, rating, milestone')
      .single()
  if (error) {
    console.error(error);
    return;
  }
  addStepModal.value.close()
}

// TOPICS
// Needed to check the checkbox of newly added Persona
const topicsInput = ref([])
// Load the Personas
const topics = ref([])
async function getTopics() {
  try {
    let { data, error, status } = await client
        .from('topics')
        .select('id, name, description')
        .order('name')
    if (error && status !== 406) throw error
    if (data) {
      topics.value = data.map((p) => {
        return {
          value: p.id,
          label: p.name
        }
      })
    }
  } catch (error) {
    alert(error.message)
  } finally {}
}


// To convert seconds to time
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function convertMsToTime(secs) {
  if(!secs) return '00:00:00.000'
  console.log(secs.toString())
  let milliseconds = (secs.toFixed(3).toString()).split('.', 2);
  let milli = milliseconds[1]
  console.log(milli)
  let seconds = Math.floor(secs)
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;


  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds)}.${milli}`;
}

const walkTimeToStamp = computed(() => convertMsToTime(props.videoTime));
const stepTimeToStamp = computed(() => convertMsToTime(stepTiming.value));




function addTopics (id) {
  topicsInput.value.node.input([...topicsInput.value.node.value, id])
}

onMounted(async () => {
  loading.value = true



  getTopics();
  // Subscribe to changes of Topis
  realtimeChannel = client
      .channel('public:topics')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'topics' },
          () => getTopics())
      .subscribe()
  loading.value = false
})

function cleanUp () {
  stepTiming.value = 0
  client.removeChannel(realtimeChannel)
  topics.value = []
}

function prepare () {
  if(props.videoTime) {
    stepTiming.value = props.videoTime
  }
}

onUnmounted(() => {
  cleanUp()
})

defineExpose({
  startAddSteps
});


</script>