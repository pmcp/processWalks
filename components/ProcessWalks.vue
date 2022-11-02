<template>
  <ui-modal ref="addWalkModal">
    <template v-slot:title>
      Add a Walk
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addWalk"
          id="addWalk"
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
              type="text"
              label="Video URL"
              name="video"
              help="The URL for the video"
          />
          <FormKit
              type="checkbox"
              label="Personas"
              name="personas"
              ref="personasInput"
              :options="personas"
              help="Add personas to this walk"
          />
          <FormKit
              type="button"
              help="Add a persona to the list"
              @click="startAddPersona"
          >
            Add a Persona
          </FormKit>
      </FormKit>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </ui-modal>
  <ui-modal ref="addPersonaModal">
    <template v-slot:title>
      Add a Persona
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          id="addPersona"
          submit-label="Add Persona"
          @submit="submitAddPersona"
      >
        <FormKit
          type="textarea"
          label="Description"
          name="description"
          help="Description of the persona"
        />
      </FormKit>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </ui-modal>
  <ui-button @click="startAddWalk">
    Add a Walk
  </ui-button>
  <div v-if="walks?.length > 0" class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li  v-for="walk of walks" :key="walk.id">
        <nuxt-link :to="`/${props.process}/${walk.id}`" class="block hover:bg-gray-50">
          <div class="flex items-center px-4 py-4 sm:px-6">
            <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
              <div class="truncate">
                <div class="flex text-sm">
                  <p class="truncate font-medium text-indigo-600">{{ walk.date }}</p>
                </div>
              </div>
            </div>
            <div class="ml-5 flex-shrink-0">
              <ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
  <div v-else>
    No walks yet
  </div>


</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const loading = ref(true)

// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

// Id of [process] is passed as prop
const props = defineProps(['process'])

// Refs to the modal, to open and close them
const addPersonaModal = ref('addPersonaModal')
const addWalkModal = ref('addWalkModal')

// Needed to check the checkbox of newly added Persona
const personasInput = ref([])

// Called from the Walks modal
const startAddPersona = (e) => {
  addPersonaModal.value.open()
  e.preventDefault();
}

const startAddWalk = () => {
  addWalkModal.value.open()
}

// Load the Personas
const personas = ref([])
async function getPersonas() {
  try {
    loading.value = true
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
  } finally {
    loading.value = false
  }
}

// Load the Walks
const walks = ref([])
async function getWalks(id) {
  console.log(`getting walks with ${id}`)
  try {
    loading.value = true
    let { data, error, status } = await client
        .from('walks')
        .select('id, date,personas, video')
        .eq('process', id)
        .order('date', { ascending: false })
    if (error && status !== 406) throw error
    if (data) {
      walks.value = data
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // TODO: Doesn't make sense to reload the personas constantly, should do this once, somehwere else.
  getPersonas();
  getWalks(props.process);

  // Subscribe to changes of Walks
  realtimeChannel = client.channel('public:[walk]').on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'walks' },
      () => getWalks(props.process)
  ).subscribe()
  // realtimeChannel.subscribe()

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

async function submitAddWalk (newWalk) {
  const { error, data } = await client.from('walks')
      .upsert({
        date: newWalk.date,
        video: newWalk.video,
        process: props.process,
        personas: newWalk.personas
      })
      .select('date, video, [process]')
      .single()
  if (error) {
    console.error(error);
    return;
  }
  addWalkModal.value.close()

}

async function submitAddPersona (item) {
  const { error, data } = await client.from('personas')
      .upsert({
        description: item.description,
      })
      .select()
  if (error) {
    return;
  }
  addPersonaModal.value.close()
  // Checkbox of added item gets checked
  const addedItem = data[0]
  personasInput.value.node.input([...personasInput.value.node.value, addedItem.id])
}

onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  walks.value = []
})

</script>