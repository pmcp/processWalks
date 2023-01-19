<template>
  <Ui-Button v-if="edit" @click="startAddWalk" :light="true">
    Edit
  </Ui-Button>
  <Ui-Button v-else @click="startAddWalk">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New Walk
  </Ui-Button>
  <Ui-Modal ref="addWalkModal">
    <template v-slot:title>
      Add Walk
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addWalk"
          id="addWalk"
          :actions="false"
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
        <div class="relative">
          <FormKit
              type="checkbox"
              label="Personas"
              name="personas"
              decorator-icon="check"
              ref="personasInput"
              :options="personas"
              help="Add personas to this walk"
          />

          <Personas-Edit mode="add" @added="addPersona"/>
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

// Supabase stuff
const client = useSupabase()
import { RealtimeChannel } from '@supabase/supabase-js'
import {getNode} from "@formkit/core";
let realtimeChannel = RealtimeChannel

const props = defineProps(['process', 'walk'])
const loading = ref(true)

const edit = computed(() => {
  if(props.walk) return true
  return false
})

const addWalkModal = ref('addWalkModal')
async function startAddWalk() {
  // If edit mode, fill form with Walk
  await addWalkModal.value.open()

  if (edit) {
    getNode('addWalk').input({
      date: props.walk.date,
      video: props.walk.video,
      process: props.walk.process,
      personas: props.walk.personas
    }).then((data) => {
    })
  }
}
//  WAS HERE
async function submitAddWalk (newWalk) {
  console.log(props.walk)
  const { error, data } = await client.from('walks')
      .upsert({
        id: props.walk.id,
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