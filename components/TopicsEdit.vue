<template>
  <ui-button @click="startAddTopic" :light="true" class="absolute -top-1 right-4">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New Topic
  </ui-button>
  <Ui-Modal ref="addTopicModal">
    <template v-slot:title>
      Add Topic
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          id="addTopic"
          :actions="false"
          @submit="submitAddTopic"
      >
        <FormKit
            type="text"
            label="Name"
            name="name"
        />
        <FormKit
            type="textarea"
            label="Description"
            name="description"
            help="Description of the topic"
        />
        <div class="absolute right-6 bottom-0">
          <FormKit type="submit">
            <template v-if="props.mode === 'edit'">
              Edit
            </template>
            <template v-else>
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Topic
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

// Props & Emits
const props = defineProps(['mode'])
const emit = defineEmits(['added'])

// UI
const addTopicModal = ref('addTopicModal')
const startAddTopic = (e) => {
  addTopicModal.value.open()
  e.preventDefault();
}

// Store
const topics = useTopicsStore();

async function submitAddTopic (data) {
  const newTopic = await topics.add(data)
  addTopicModal.value.close()
  emit('added', newTopic[0].id)
}


</script>