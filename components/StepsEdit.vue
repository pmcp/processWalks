<template>
  <Ui-Button @click="startAddSteps">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New Step
  </Ui-Button>
  <Ui-Modal ref="addStepModal">
    <template v-slot:title>
      Add Step
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          name="addSteps"
          id="addSteps"
          submit-label="Add Step"
          @submit="submitAddStep"
      >
        <FormKit
            type="time"
            label="Timing"
            name="timing"
            help="Timing in the video"
            validation="required"
            validation-visibility="live"
        />
        <FormKit
            type="textarea"
            label="Description"
            name="description"
            help="What is happening in this step?"
        />
        <FormKit
            type="textarea"
            label="Observation"
            name="observation"
            help="What do you take away from this moment?"
        />
        <FormKit
            type="checkbox"
            label="Milestone"
            name="milestone"
            help="Is this an important moment in the walk?"
        />
        <FormKit
            type="rating"
            rating-icon="star"
            min="1"
            max="10"
            label="How do you rate the experience of this step?"
            name="rating"
            id="rating"
        />
        <FormKit
            type="checkbox"
            label="Topics"
            name="topics"
            ref="topicsInput"
            :options="topics"
            help="Tags this walk with topics"
        />

        <Topics-Edit mode="add" @added="addTopics"/>
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

const props = defineProps(['walk', 'mode'])

const addStepModal = ref('addStepModal')
const loading = ref(true)


const startAddSteps = () => {
  addStepModal.value.open()
}


if(props.mode === 'edit') {}


async function submitAddStep (item) {
  console.log(item)
  const { error, data } = await client.from('steps')

      .upsert({
        walk: props.walk,
        timing: item.timing,
        description: item.description,
        observation: item.observation,
        topics: item.topics,
        rating: item.rating,
        milestone: item.milestone
      })
      .select('timing, description, observation, topics, rating, milestone')
      .single()
  if (error) {
    console.error(error);
    return;
  }
  addStepModal.value.close()
}

// TOPICS
// Needed to check the checkbox of newly added Persona
const topicsInput = ref([])
// Load the Personas
const topics = ref([])
async function getTopics() {
  try {
    let { data, error, status } = await client
        .from('topics')
        .select('id, name, description')
        .order('name')
    if (error && status !== 406) throw error
    if (data) {
      topics.value = data.map((p) => {
        return {
          value: p.id,
          label: p.name
        }
      })
    }
  } catch (error) {
    alert(error.message)
  } finally {}
}

function addTopics (id) {
  topicsInput.value.node.input([...topicsInput.value.node.value, id])
}

onMounted(async () => {
  loading.value = true
  getTopics();
  // Subscribe to changes of Topis
  realtimeChannel = client
      .channel('public:topics')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'topics' },
          () => getTopics())
      .subscribe()
  loading.value = false
})

onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  topics.value = []
})


</script>