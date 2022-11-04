<template>
  <ui-button @click="startAddPersona">
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    New Persona
  </ui-button>
  <Ui-Modal ref="addPersonaModal">
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
  </Ui-Modal>
</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'
const addPersonaModal = ref('addPersonaModal')
const client = useSupabaseClient()
const props = defineProps(['mode'])
const emit = defineEmits(['added'])

const startAddPersona = (e) => {
  addPersonaModal.value.open()
  e.preventDefault();
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
  emit('added', data[0].id)
}


</script>