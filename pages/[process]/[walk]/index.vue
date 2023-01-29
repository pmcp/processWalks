<template>

  <div v-if="walk">
    <ui-slide-over ref="slideOver" @close="closeStepSlideOver">
      <Actions-List :step="activeStep" :actions="activeStep.actions"/>
    </ui-slide-over>
<!--    <Steps-List :steps="walk.steps" @editStep="editStep" @seekVideoTime="seekVideoTime" @showActions="showActions"/>-->
    <Walks-Layout>
      <template v-slot:steps>
        <Steps-List :steps="walk.steps" @editStep="editStep" @seekVideoTime="seekVideoTime" @showActions="showActions"/>
      </template>
      <template v-slot:video>
        <div v-if="walk.videoTempUrl">
          <Player :video="walk.videoTempUrl" ref="VideoPlayer" @timeupdate="video.updateTime"/>
          <div class="flex flex-row justify-between mt-2 ">
            <Form-File-Upload :light="true" @upload="addVideo" />
            <Steps-Edit ref="stepsEdit" :walk="walk.id" :videoTime="currentTime" :videoUrl="walk.videoTempUrl" @stopPlayer="$refs.VideoPlayer.player.pause()" />
          </div>
        </div>
        <div v-else class="h-full rounded-lg border-4 border-dashed border-gray-200 flex justify-center py-20">
          <Form-File-Upload :light="true" :empty="walk.videoTempUrl == null" @upload="addVideo" />
        </div>
      </template>
      <template v-slot:process>
        <Processes-Detail :process="walk.processes">
          <template v-slot:content>
            <div class="flex justify-between">
              <span class="text-lg">Walk</span>

              <Walks-Edit :walk="walk"></Walks-Edit>
            </div>
            <h3 class="text-md font-medium leading-6 my-4">Date: {{ walk.date }}</h3>
            <div>
              <Personas-List :personas="walk.personas"/>
            </div>
          </template>
        </Processes-Detail>
      </template>
    </Walks-Layout>
  </div>
</template>
<script setup>
const route = useRoute()


// UI Stuff
// Slide Over Logic
const slideOver = ref('slideOver')
let activeStepId = ref(null)
function closeStepSlideOver(){}

// Stores
import { storeToRefs } from 'pinia'
const walks = useWalksStore();
const steps = useStepsStore();
const actions = useActionsStore();
const processes = useProcessesStore();

// Get Walk
const { single: walk } = storeToRefs(walks)
walks.get(route.params.walk)

// Video Stuff

const video = useVideoStore();
const { player, currentTime } = storeToRefs(video)

async function addVideo(upload) {
  console.log(upload)
  video.add(upload, route.params.walk)
}


// Show slide over with actions
function showActions(step) {
  activeStepId.value = step.id
  slideOver.value.open()
}
const activeStep = computed(() => {
  if(!activeStepId.value) return null
  const activeStep = walk.value.steps.filter(step => step.id === activeStepId.value)
  return activeStep[0]
})

// Use the video player
const VideoPlayer = ref(null)
function seekVideoTime(time) {
  VideoPlayer.value.player.currentTime(time)
  VideoPlayer.value.player.play()
}

const stepsEdit = ref({})
function editStep(id) {
  console.log(id)
  console.log(stepsEdit)
  console.log(stepsEdit.value.startAddSteps)

  if(!stepsEdit.value) return;
  stepsEdit.value.startAddSteps(id)
}

onMounted(async () => {
  const walkId = route.params.walk
  walks.subscribeSingle(walkId)
  walks.subscribeJoinWalksPersonas(walkId)
  walks.subscribeJoinWalksActions(walkId)
  steps.subscribeList(walkId)
  steps.subscribeJoinStepsTopics(walkId)
  actions.subscribeList(walkId)
  processes.subscribeSingle(route.params.process, walkId)
  // TODO: Add subscribe for steps_topics
})

onUnmounted(() => {
  walks.unsubscribeSingle()
  walks.unsubscribeJoinWalksPersonas()
  walks.unsubscribeJoinWalksActions()
  steps.unsubscribeList()
  steps.unsubscribeJoinStepsTopics()
  actions.unsubscribeList()
  processes.unsubscribeSingle()
  // TODO: Add unsubscribe for steps_topics
})

</script>