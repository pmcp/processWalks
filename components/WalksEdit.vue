<template>
  <Ui-Button v-if="edit" @click="open" :light="true">
    Edit
  </Ui-Button>
  <Ui-Button v-else @click="open">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New Walk
  </Ui-Button>
  <Ui-Modal ref="walkModal">
    <template v-slot:title>
      <span v-if="edit">Edit Walk</span>
      <span v-else>Add Walk</span>
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addWalk"
          id="addWalk"
          ref="addWalkNode"
          :actions="false"
          submit-label="Add Walk"
          @submit="saveWalk"
      >
        <FormKit
            type="date"
            label="Date"
            name="date"
            help="When was the date of the walk?"
            validation="required"
            validation-visibility="live"
        />
        <div class="relative">
          <FormKit
              type="checkbox"
              label="Personas"
              name="personas"
              decorator-icon="check"
              ref="personasInput"
              :options="personasList"
              help="Add personas to this walk"
          />
          <FormKit
              v-if="edit"
              type="textarea"
              label="Notes"
              name="notes"
              rows="10"
              help="Extra notes about this walk."
          />

          <FormKit
            v-if="edit"
            type="file"
            name="newDocs"
            label="Documents"
            accept=".pdf,.doc,.docx,.xml,.md,.csv"
            help="Select a document to add to this walk."
            multiple="false"
          />
          <ui-button :light="true" class="my-2">
            <a :href="walk.docTempUrl" download>View uploaded doc</a>
          </ui-button>
<!--          <Form-File-Upload v-if="edit" :light="true" :type="'file'" :empty="!walk.doc"  @upload="addFile" />-->
          <Personas-Edit mode="add" @added="addPersonaToPersonaList"/>
        </div>
        <div class="absolute right-6 bottom-0">
          <FormKit type="submit">
            <template v-if="edit">
              Save
            </template>
            <template v-else>
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Walk
            </template>
          </FormKit>
        </div>
      </FormKit>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'

// PROPS
const props = defineProps(['process', 'walk'])

// UI Refs
const walkModal = ref('walkModal')

// Formkit
import {getNode} from "@formkit/core";

const addWalkNode = ref(null)

// Stores
import { storeToRefs } from 'pinia'
const walks = useWalksStore();

// If a walk is passed as prop, we are editing this walk
const edit = computed(() => {
  if(props.walk) return true
  return false
})

const personasFormkitFormatted = computed(() => {
  return props.walk.personas.map((p) => p.id)
})

async function open() {
  // If edit mode, fill form with Walk
  await walkModal.value.open()
  if (edit.value) {
    console.log(personasFormkitFormatted.value)
    addWalkNode.value.node.input({
      date: props.walk.date,
      video: props.walk.video,
      process: props.walk.process,
      notes: props.walk.notes,
      personas: personasFormkitFormatted.value
    }).then((data) => {
    })
  }
}


// PERSONAS
const personas = usePersonasStore();
const { listFormkitFormatted: personasList } = storeToRefs(personas)
// Needed to check the checkbox of newly added Personas
// Get the ref for the Formkit
const personasInput = ref([])
// Add to the Formkit input list, called from emit PersonasEdit
function addPersonaToPersonaList (personaId) {
  personasInput.value.node.input([...personasInput.value.node.value, personaId])
}

await personas.getAll()

async function saveWalk(data) {


  if(edit.value) {
    console.log('editing walk', props.walk)
    data.id = props.walk.id
    const oldPersonas = props.walk.personas.map(x => x.id)
    walks.edit(data, oldPersonas)
  } else {
    await walks.add(data, props.process)
  }
  await walkModal.value.close()
}

onMounted(async () => {
  personas.subscribe()
})

onUnmounted(() => {
  personas.unsubscribe()

})


</script>