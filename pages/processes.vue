<template>
  <div class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center"> 
    <ui-slide-over ref="slideOver" @close="closeSlideOver">
      <Processes-Detail :process="activeProcess" />
      <Walks-List :process="activeProcess.id" />
    </ui-slide-over>
    <div class="container" >
      <processes-list :processes="processes" @open="openProcess" />
    </div>
  </div>
</template>

<script setup>
// UI Vars
const loading = ref(true)
const error = ref(true)

// Supabase stuff
const client = useSupabaseClient()

// Slide Over Menu
const slideOver = ref('slideOver')

const openProcess = (processId) => {
  // Set the [process] id, so Walks can be loaded
  console.log(processId)
  activeProcessId.value = processId
  slideOver.value.open()
}
const closeSlideOver = () => {
  // The closing itself is done from the component (emit on the component), we just need to clear the active [process]
  activeProcessId.value = null
}


// Active Process is a computed based on activeProcessId
let activeProcessId = ref(null)
const activeProcess = computed(() => {
  return processes.value.find(item => item.id === activeProcessId.value);
});

// Load the Processes
let processes = ref([])
async function getProcesses () {
  loading.value = true;
  try {
    let { data, error, status } = await client
        .from('processes')
        .select('id, name, passwordProtected, description', )
        .order('created_at', { ascending: false })
    if (error && status !== 406) throw error
    if (data) {
      processes.value = data
    }
  } catch (error) {
    console.log(error)
    error.value = error.message
  } finally {
    loading.value = false
  }
}
await getProcesses()

// Once mounted, start tracking updates
import { RealtimeChannel } from '@supabase/supabase-js'
let processesRealtimeChannel = RealtimeChannel
onMounted(() => {
  processesRealtimeChannel = client
    .channel('public:[process]')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'processes' },
        () => getProcesses())
    .subscribe()
})
onUnmounted(() => {
  client.removeChannel(processesRealtimeChannel)
  processes.value = []
})



</script>