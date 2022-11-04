<template>
  <Ui-Button @click="startAddWalk">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New Walk
  </Ui-Button>
  <Ui-Modal ref="addWalkModal">
    <template v-slot:title>
      Add a Walk
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addWalk"
          id="addWalk"
          :value="addWalkValue"
          submit-label="Add Walk"
          @submit="submitAddWalk"
      >
        <FormKit
            type="date"
            label="Date"
            name="date"
            help="When was the date of the walk?"
            validation="required"
            validation-visibility="live"
        />
        <FormKit
            type="checkbox"
            label="Personas"
            name="personas"
            ref="personasInput"
            :options="personas"
            help="Add personas to this walk"
        />

        <Personas-Edit mode="add" @added="addPersona"/>
      </FormKit>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'

// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

const props = defineProps(['process', 'mode'])

const addWalkModal = ref('addWalkModal')
const loading = ref(true)
const addWalkValue = ref({})

const startAddWalk = () => {
  addWalkModal.value.open()
}

const startAddPersona = (e) => {
  addPersonaModal.value.open()
  e.preventDefault();
}

// if(props.mode === 'edit') {}


async function submitAddWalk (newWalk) {


  const { error, data } = await client.from('walks')
      .upsert({
        date: newWalk.date,
        video: newWalk.video,
        process: props.process,
        personas: newWalk.personas
      })
      .select('date, video, process')
      .single()
  if (error) {
    console.error(error);
    return;
  }
  addWalkModal.value.close()

}

// PERSONAS
// Needed to check the checkbox of newly added Persona
const personasInput = ref([])
// Load the Personas
const personas = ref([])
async function getPersonas() {
  try {
    let { data, error, status } = await client
        .from('personas')
        .select('id, description')
        .order('description')
    if (error && status !== 406) throw error
    if (data) {
      personas.value = data.map((p) => {
        return {
          value: p.id,
          label: p.description,
        }
      })
    }
  } catch (error) {
    alert(error.message)
  } finally {}
}

function addPersona (personaId) {
  personasInput.value.node.input([...personasInput.value.node.value, personaId])
}

onMounted(async () => {
  loading.value = true
  getPersonas();
  // Subscribe to changes of Personas
  realtimeChannel = client
      .channel('public:personas')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'personas' },
          () => getPersonas())
      .subscribe()
  loading.value = false
})

onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  personas.value = []
})


</script>