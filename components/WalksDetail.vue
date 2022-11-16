<template>
  <div v-if="walk" class="sticky top-0 z-10 bg-white p-2 border-b-2 border-gray-50">
    <div v-if="walk.video">
      <Player :video="walk.video" ref="walksVideoPlayer" @timeupdate="updateTime"/>
      <div class="flex flex-row justify-between mt-2">
        <Form-File-Upload :light="true" @upload="addVideo" />
        <Steps-Edit class=" grow" ref="addEditStep"  :walk="props.walk" :step="props.step"  :videoTime="currentVideoTime" :videoUrl="walk.video" @stopPlayer="$refs.walksVideoPlayer.player.pause()" />
      </div>
    </div>
    <div v-else class="h-full rounded-lg border-4 border-dashed border-gray-200 flex justify-center py-20">
      <Form-File-Upload :light="true" :empty="walk.video == null" @upload="addVideo" />
    </div>
  </div>
  <Processes-Detail v-if="process" :process="process" :hide-walks="true"/>
  <Personas-List v-if="walk" :personas="walk.personas"/>
</template>
<script setup>

const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

const props = defineProps(['process', 'walk', 'step', 'mode'])

const loading = ref(false)
const walk = ref(null)
const process = ref(null)

const walksVideoPlayer = ref(null)
const mode = ref('add')


const addEditStep = ref(null);

function startAddSteps(stepId) {
  if(stepId) mode.value = 'edit'
  addEditStep.value.startAddSteps(stepId)

}


function seekVideoTime(time){
  walksVideoPlayer.value.player.currentTime(time)
}


const currentVideoTime = ref(0)
// Get Walk
async function getWalk(walkId) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('walks')
        .select(`date, video, personas, process`)
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

const updateTime = (time) => currentVideoTime.value = time

// Get Process
async function getProcess(processId) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('processes')
        .select(`id, name, passwordProtected, password, description, stages`)
        .eq('id', processId)
        .single()

    if (error && status !== 406) throw error
    if (data) {
      data.stages = data.stages.map(x => JSON.parse(x))
      process.value = data
    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}

async function addVideo(video) {
  const { error } = await client
      .from('walks')
      .update({ video: video })
      .eq('id', props.walk)
    getWalk(props.walk)
}

getProcess(props.process)
getWalk(props.walk)

onMounted(async () => {
  loading.value = true
  // Subscribe to changes of Processes
  realtimeChannel = client
      .channel()
      .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'processes', filter: `id=eq.${props.process}` },
          data => {
            data.new.stages = data.new.stages.map(x => JSON.parse(x))
            process.value = data.new
          })
      .subscribe()
  loading.value = false
})

onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  personas.value = []
})

defineExpose({
  startAddSteps,
  seekVideoTime
});



</script>









