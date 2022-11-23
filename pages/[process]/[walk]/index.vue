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
            <div v-if="walk.video">
              <Player :video="walk.video" ref="VideoPlayer" @timeupdate="updateTime"/>
              <div class="flex flex-row justify-between mt-2 ">
                <Form-File-Upload :light="true" @upload="addVideo" />
                <Steps-Edit ref="stepsEdit" :walk="walk.id" :videoTime="currentVideoTime" :videoUrl="walk.video" @stopPlayer="$refs.VideoPlayer.player.pause()" />
              </div>
            </div>
            <div v-else class="h-full rounded-lg border-4 border-dashed border-gray-200 flex justify-center py-20">
              <Form-File-Upload :light="true" :empty="walk.video == null" @upload="addVideo" />
            </div>
          </div>
        </div>

        <Processes-Detail :process="walk.processes">
          <template v-slot:content>
            <h3 class="text-lg font-medium leading-6 my-4">Date: {{ walk.date }}</h3>
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
const loading = ref(true)


// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let StepsRealtimeChannel = RealtimeChannel
let ActionsRealtimeChannel = RealtimeChannel

// Get Walk
const walk = ref(null)
async function getWalk(walkId) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('walks')
        .select(`id, date, video, personas, processes(id, description, name), steps!steps_walk_fkey(id, walk, description, timing, observation, milestone, topics, rating, actions(id, description, act_by, done, walk, assigned_to))`)
        .eq('id', walkId)
        .single()
    if (error && status !== 406) throw error
    if (data) {
      // Get signed Url of video
      if(data.video) {
        const videoUrl = await client
            .storage
            .from('movies')
            .createSignedUrl(data.video, 3600)
        data.video = videoUrl.data.signedUrl
      }
      walk.value = data
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
getWalk(route.params.walk)

// Video Stuff
const currentVideoTime = ref(0)
const updateTime = (time) => currentVideoTime.value = time

// Slide Over Logic
const slideOver = ref('slideOver')
let activeStepId = ref(null)
function closeStepSlideOver(){}
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

// Uploading a video
async function addVideo(video) {
  const { error } = await client
      .from('walks')
      .update({ video: video })
      .eq('id', route.params.walk)
  getWalk(route.params.walk)
}

onMounted(async () => {
  loading.value = true
  // Subscribe to changes of Steps
  StepsRealtimeChannel = client
      .channel('steps')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'steps', filter: `walk=eq.${route.params.walk}` },
          data => {
            getWalk(route.params.walk)
          })
      .subscribe()
  ActionsRealtimeChannel = client
      .channel('actions')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'actions', filter: `walk=eq.${route.params.walk}` },
          data => {
            getWalk(route.params.walk)
          })
      .subscribe()
  loading.value = false
})

onUnmounted(() => {
  client.removeChannel(StepsRealtimeChannel)
  client.removeChannel(ActionsRealtimeChannel)
})

</script>