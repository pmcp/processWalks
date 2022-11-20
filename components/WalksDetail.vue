<template>

  <h3 v-if="walk  " class="text-lg font-medium leading-6 my-6">Date: {{ walk.date }}</h3>
  <Personas-List v-if="walk" :personas="walk.personas"/>
  <div class="my-4">
    <Processes-Detail v-if="processObject" :process="processObject" :hide-walks="true" :hide-edit="true"/>
  </div>

</template>
<script setup>

const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

const props = defineProps(['process', 'walk', 'step', 'mode'])
const loading = ref(false)
const walk = ref(null)
const processObject = ref(null)

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

})

defineExpose({
  startAddSteps,
  seekVideoTime
});



</script>









