<template>
  <div>
  <div class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center" v-if="walk">
    <ui-slide-over ref="slideOver" @close="closeStepSlideOver">
      <Actions-List :step="activeStep" :actions="activeStep.actions"/>
    </ui-slide-over>
    <section  class="sticky top-0 flex min-w-0 flex-1 flex-col lg:order-last">
      <Steps-List :steps="walk.steps" @editStep="editStep" @seekVideoTime="seekVideoTime" @showActions="showActions"/>
    </section>

    <aside class="hidden lg:order-first lg:block lg:flex-shrink-0 h-full">
      <div class="relative flex gap-8 w-96 pr-2 flex-col border-r border-gray-200 h-full">
        <div class="sticky top-5 z-10 bg-white border-b-2 border-gray-50">
          <div class="px-2 pb-4 shadow-xl rounded-lg">
            <div v-if="walk.videoTempUrl">
              <Player :video="walk.videoTempUrl" ref="VideoPlayer" @timeupdate="video.updateTime"/>
              <div class="flex flex-row justify-between mt-2 ">

                <Form-File-Upload :light="true" @upload="addVideo" />
                <Steps-Edit ref="stepsEdit" :walk="walk.id" :videoTime="currentVideoTime" :videoUrl="walk.videoTempUrl" @stopPlayer="$refs.VideoPlayer.player.pause()" />
              </div>
            </div>
            <div v-else class="h-full rounded-lg border-4 border-dashed border-gray-200 flex justify-center py-20">
              <Form-File-Upload :light="true" :empty="walk.videoTempUrl == null" @upload="addVideo" />
            </div>
          </div>
        </div>

        <Processes-Detail :process="walk.processes">
          <template v-slot:content>
            <div class="flex justify-between"><span class="text-lg">Walk</span><Walks-Edit :walk="walk"></Walks-Edit></div>
            <h3 class="text-md font-medium leading-6 my-4">Date: {{ walk.date }}</h3>
            <div>
              <Personas-List :personas="walk.personas"/>
            </div>
          </template>
        </Processes-Detail>
      </div>
    </aside>
  </div>
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
const { player, currentTime } = storeToRefs(walks)
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

const stepsEdit = ref(null)
function editStep(id) {
  if(!stepsEdit.value) return;
  stepsEdit.value.startAddSteps(id)
}

onMounted(async () => {
  const walkId = route.params.walk
  walks.subscribeSingle(walkId)
  steps.subscribeList(walkId)
  walks.subscribeJoinWalksPersonas(walkId)
  steps.subscribeJoinStepsTopics(walkId)
  actions.subscribeList(walkId)
  processes.subscribeSingle(route.params.process, walkId)

  // TODO: Add subscribe for steps_topics
})

onUnmounted(() => {
  walks.unsubscribeSingle()
  steps.unsubscribeList()
  actions.unsubscribeList()
  processes.unsubscribeSingle()
  // TODO: Add unsubscribe for steps_topics
})

</script>