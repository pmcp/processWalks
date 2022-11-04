<template>
  <div  class="sticky top-0 z-10 bg-white p-2 border-b-2 border-gray-50">
    <Video-Detail v-if="walk" @upload="addVideo" :video="walk.video" />
    <Steps-Edit  :walk="props.walk"/>
  </div>


  <Processes-Detail v-if="process" :process="process" :hide-walks="true"/>
  <Personas-List v-if="walk" :personas="walk.personas"/>

<!--  <pre>{{ walk}}</pre>-->
<!--  <pre>{{ process }}</pre>-->


</template>
<script setup>
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

const props = defineProps(['process', 'walk'])

const loading = ref(false)
const walk = ref(null)
const process = ref(null)

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
      console.log('THe video', data.video)
      const videoUrl = await client
          .storage
          .from('movies')
          .createSignedUrl(data.video, 3600)
      data.video = videoUrl.data.signedUrl
      walk.value = data
    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}

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
      console.log(data)
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
  // Subscribe to changes of Personas
  realtimeChannel = client
      .channel()
      .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'processes', filter: `id=eq.${props.process}` },
          data => {
            console.log()
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


</script>









