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
        <Ui-Button :light="true" @click="steps.setCurrentTime($refs.stepVideoPlayer.player.currentTime())"><span class="underline">Save current time</span></Ui-Button>
      </div>
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addSteps"
          id="addSteps"
          :actions="false"
          @submit="addStep"
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
              :options="TopicListFormatted"
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
      <Ui-Button @click="removeStep(stepId)" v-if="mode == 'edit'">
        Delete Step
      </Ui-Button>
      <p class="pt-4 text-rose-600"><span class="italic text-sm ">{{ errorMessage }}</span></p>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'

// Props & Emits
const props = defineProps(['walk', 'videoUrl', 'videoTime'])
const emit = defineEmits(['stopPlayer'])

// UI
const addStepModal = ref('addStepModal')
const stepVideoPlayer = ref(null)

let previousTopics = []

// Store
import { storeToRefs } from 'pinia'
const steps = useStepsStore();
const topics = useTopicsStore();
const { id: stepId, timing: stepTiming } = storeToRefs(steps)
const { listFormkitFormatted: TopicListFormatted } = storeToRefs(topics)


import { getNode } from '@formkit/core';

// Starting the adding or editing of the step
const mode = ref('add')

async function addStep(step){
  if(mode.value === 'edit') {
    console.log('edit Step', step )
    await steps.edit(step, previousTopics, )
  } else {
    console.log('add Step', step )
    await steps.add(step, props.walk)
  }
  addStepModal.value.close()
}

async function removeStep(){
  await steps.remove(stepId)
  addStepModal.value.close()
}

async function startAddSteps(id) {
  console.log('opening modal')
  emit('stopPlayer')
  addStepModal.value.open()

  if(id) {
    mode.value = 'edit'

    steps.setStepId(id)
    const data = await steps.get(id)
    previousTopics = data.topics
    console.log('got previousTopics', previousTopics )
    // Set timing for video
    steps.setCurrentTime(data.timing)
    stepVideoPlayer.value.player.currentTime(data.timing)
    const topicsFormattedForFormkit = data.topics.map((t) => t.id)



    console.log(data, topicsFormattedForFormkit)
    // Fill Form
    getNode('addSteps').input({
      id,
      walk: data.walk,
      description: data.description,
      observation: data.observation,
      topics: topicsFormattedForFormkit,
      rating: data.rating,
      milestone: data.milestone
    }).then((data) => {
      console.log('set data as input for form', data)
    })

  } else {
    mode.value = 'add'
  }
}

// TOPICS
await topics.getAll()

// Make time readable
import {useReadableTime} from "../utils/readableTime";

const walkTimeToStamp = computed(() => useReadableTime(props.videoTime));
const stepTimeToStamp = computed(() => useReadableTime(stepTiming.value));

const topicsInput = ref([])
function addTopics (id) {
  topicsInput.value.node.input([...topicsInput.value.node.value, id])
}

// Get the topics (and keep them realtime updated)
onMounted(async () => {
  topics.subscribe()
})

function cleanUp () {
  stepTiming.value = 0
  topics.unsubscribe()
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