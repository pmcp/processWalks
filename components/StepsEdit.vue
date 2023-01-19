<template>
  <Ui-Button @click="startAddSteps(null)">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New step at <span class="w-24 pl-1 text-center">{{ walkTimeToStamp }}</span>
  </Ui-Button>

  <Ui-Modal ref="addStepModal" @closed="cleanUp" @opened="setUp">
    <template v-slot:title>
      <Player :video="videoUrl" :startTime="videoTime"  ref="stepVideoPlayer" />
      <div class="flex flex-row justify-between mt-2">
        <Ui-Button :light="true" @click="$refs.stepVideoPlayer.player.currentTime(stepTiming)"><span class="underline">Go to step ({{ stepTimeToStamp }})</span></Ui-Button>
        <Ui-Button :light="true" @click="setCurrentTime($refs.stepVideoPlayer.player.currentTime())"><span class="underline">Save current time</span></Ui-Button>
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
            decorator-icon="star"
            label="Milestone"
            name="milestone"
            help="Is this an important moment in the walk?"
        />
        <FormKit
            type="range"
            min="-4"
            max="4"
            prefix-icon="sad"
            suffix-icon="EmojiHappyIcon"
            label="How do you rate the experience of this step?"
            name="rating"
            id="rating"
        />
        <div class="relative">
          <FormKit
              type="checkbox"
              decorator-icon="check"
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
          <template v-if="mode === 'edit'">
            Save changes
          </template>
          <template v-else>
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Step
          </template>
        </FormKit>
        </div>
      </FormKit>
      <Ui-Button @click="deleteStep" v-if="mode == 'edit'">
        Delete Step
      </Ui-Button>
      <p class="pt-4 text-cyan-600"><span class="italic text-sm ">{{ errorMessage }}</span></p>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'
const loading = ref(true)

// Supabase stuff
const client = useSupabase()
import { RealtimeChannel } from '@supabase/supabase-js'
let topicsRealtimeChannel = RealtimeChannel

const props = defineProps(['walk', 'videoUrl', 'videoTime'])
const emit = defineEmits(['stopPlayer'])

const addStepModal = ref('addStepModal')

const stepVideoPlayer = ref(null)


let stepId = null;

const errorMessage = ref('')

// Changing the time
const stepTiming = ref(null)
function setCurrentTime(val) {
  stepTiming.value = val
}

// Starting the adding or editing of the step
const mode = ref('add')
async function startAddSteps(id) {
  emit('stopPlayer')
  addStepModal.value.open()
  console.log(id)
  if(id) {

    mode.value = 'edit'
    // Store this in let, for deleting if needed
    stepId = id
    await getStep(id)
  } else {
    mode.value = 'add'
  }

  console.log(mode.value)

}

async function deleteStep() {
  const { error } = await client
      .from('steps')
      .delete()
      .eq('id', stepId)
  console.log(error)
  if(error) {
    console.log(error.code)
    if(error.code == 23503) {
      console.log('setting errorMessage')
      errorMessage.value = 'There are still action cards connected with this step. Delete these first.'
    }
  } else {
    addStepModal.value.close()
  }
}

import { getNode } from '@formkit/core';
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

// Make time readable
import {useReadableTime} from "../utils/readableTime";
const walkTimeToStamp = computed(() => useReadableTime(props.videoTime));
const stepTimeToStamp = computed(() => useReadableTime(stepTiming.value));


function addTopics (id) {
  topicsInput.value.node.input([...topicsInput.value.node.value, id])
}

// Get the topics (and keep them realtime updated)
onMounted(async () => {
  loading.value = true
  getTopics();
  // Subscribe to changes of Topics
  topicsRealtimeChannel = client
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
  client.removeChannel(topicsRealtimeChannel)
  topics.value = []
}

function setUp () {
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