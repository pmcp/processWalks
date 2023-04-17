<template>
  <Steps-Edit ref="stepsEdit"  @stopPlayer="$refs.VideoPlayer.player.pause()" />
  <div v-if="walk">
    <ui-slide-over ref="slideOver" @close="closeStepSlideOver">
      <Actions-List :step="activeStep" :actions="activeStep.actions"/>
    </ui-slide-over>
<!--    <Steps-List :steps="walk.steps" @editStep="editStep" @seekVideoTime="seekVideoTime" @showActions="showActions"/>-->
    <Walks-Layout>
      <template #steps="{ layout }">

        <Steps-List :steps="walk.steps" @editStep="editStep" @seekVideoTime="seekVideoTime" @showActions="showActions" :layout="layout"/>
      </template>
      <template v-slot:video>
        <div v-if="walk.videoTempUrl">
          <div>
            <Form-File-Upload :light="true" type="video" @upload="addVideo" class="mb-2" />

          </div>

          <Player :video="walk.videoTempUrl" ref="VideoPlayer" @timeupdate="video.updateTime"/>
          <div class="flex flex-row justify-between mt-2 ">

            <Ui-Button @click="editStep(null, walk.id, walk.videoTempUrl, currentTime)" style="width:100%">
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
<!--              New step at <span class="w-24 pl-1 text-center">{{ walkTimeToStamp }}</span>-->
              New step at <span class="w-24 pl-1 text-center">{{  walkTimeToStamp }}</span>
            </Ui-Button>

          </div>
        </div>
        <div v-else class="h-full rounded-lg border-4 border-dashed border-gray-200 flex justify-center py-20">
          <Form-File-Upload :light="true" type="video"  :empty="walk.videoTempUrl == null" @upload="addVideo" />
        </div>
      </template>
      <template v-slot:process>
        <Processes-Detail :process="walk.processes">
          <template v-slot:content>
            <div class="flex justify-between">
              <span class="text-lg">Walk</span>
              <Walks-Edit :walk="walk"></Walks-Edit>
            </div>

            <ui-button v-if="walk.docTempUrl" :light="true" class="my-2" >
              <a :href="walk.docTempUrl" download>View Doc</a>
            </ui-button>

            <ui-button v-if="walk.notes" :light="true" class="my-2" @click="showNotes.open()">
              Show notes
            </ui-button>

            <Ui-Modal v-if="walk.notes" ref="showNotes">
              <template v-slot:title>
                Notes
              </template>
              <template v-slot:content>
                <pre>{{ walk.notes }}</pre>
              </template>
              <template v-slot:closeButton>
                Close
              </template>
            </Ui-Modal>

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
import { PlusIcon } from '@heroicons/vue/20/solid'

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

const showNotes = ref('showNotes')



// Get Walk
const { single: walk } = storeToRefs(walks)
walks.get(route.params.walk)

// Video Stuff
const video = useVideoStore();
const { player, currentTime } = storeToRefs(video)

import {useReadableTime} from "/utils/readableTime";
const walkTimeToStamp = computed(() => useReadableTime(currentTime.value));

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
function editStep(id, walkId, videoUrl, videoTime) {
  if(!stepsEdit.value) return;
  console.log(id, walkId, videoUrl, videoTime)
  stepsEdit.value.startAddSteps(id, walkId, videoUrl, videoTime )
}

onMounted(async () => {
  const walkId = route.params.walk
  walks.subscribeSingle(walkId)
  walks.subscribeJoinWalksPersonas(walkId)
  walks.subscribeJoinWalksActions(walkId)
  steps.subscribeList(walkId)
  steps.subscribeJoinStepsTopics(walkId)
  actions.subscribeList(walkId)
  processes.subscribeSingle(route.params.process, walkId, )
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