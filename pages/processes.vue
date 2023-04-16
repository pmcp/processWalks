<template>
  <div class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
    <div class="hidden lg:col-span-3 lg:block xl:col-span-2">
      <!-- Dropdown with all personas -->
<!--      Personas: {{ personasList }}-->
<!--      <FormKit-->
<!--          type="select"-->
<!--          label="Filter by persona"-->
<!--          name="country"-->
<!--          placeholder="Select a country"-->
<!--          :options="personasList"-->
<!--          v-model="personaSelected"-->
<!--      />-->


    </div>
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

import { storeToRefs } from 'pinia'
const processes = useProcessesStore();
const personas = usePersonasStore();
const { getAll: getAllPersonas } = personas
const { listFormkitFormatted: personasList,  } = storeToRefs(personas)
getAllPersonas()



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