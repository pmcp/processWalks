<template>
  <ui-button @click="startAddPersona" :light="true" class="absolute -top-1 right-4">
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
          :actions="false"
          @submit="addPersona"
      >
        <FormKit
            type="textarea"
            label="Description"
            name="description"
            help="Description of the persona"
        />
        <div class="absolute right-6 bottom-0">
          <FormKit type="submit">
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Persona
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
const addPersonaModal = ref('addPersonaModal')
const emit = defineEmits(['added'])

const personas = usePersonasStore();

const startAddPersona = (e) => {
  addPersonaModal.value.open()
  e.preventDefault();
}

async function addPersona(data) {
  const newPersona = await personas.add(data)
  addPersonaModal.value.close()
  emit('added', newPersona[0].id)
}

</script>