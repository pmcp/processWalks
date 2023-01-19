<template>
  <div class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center"> 
    <ui-slide-over ref="slideOver" @close="closeSlideOver">
      <Walks-List :process="activeProcess.id" />
    </ui-slide-over>
    <div class="container" >
      <processes-list :processes="list" @open="openProcess" />
    </div>
  </div>
</template>

<script setup>
// Slide Over Menu
const slideOver = ref('slideOver')
const openProcess = (processId) => {
  activeProcessId.value = processId
  slideOver.value.open()
}
const closeSlideOver = () => {
  // The closing itself is done from the component (emit on the component), we just need to clear the active [process]
  activeProcessId.value = null
}

const processes = useProcessesStore();
import { storeToRefs } from 'pinia'
const { activeProcessId, activeProcess, list } = storeToRefs(processes)
const { getAll } = processes
// Load the Processes
await getAll()

onMounted(() => {
  processes.subscribe()
})
onUnmounted(() => {
  processes.unsubscribe()
})



</script>