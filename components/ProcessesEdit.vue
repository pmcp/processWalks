<template>
  <Ui-Button @click="startAddProcess" :mode="mode.value" :light="mode === 'edit'">
      <template v-if="mode === 'edit'">
        Edit
      </template>
      <template v-else>
        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Add a Process
      </template>
  </Ui-Button>
  <Ui-Modal ref="addProcessModal">
    <template v-slot:title>
      <span v-if="mode === 'edit'">Edit Process</span>
      <span v-else>Add Process</span>
    </template>
    <template v-slot:content>
      <FormKit
          type="form"
          id="addProcess"
          name="addProcess"
          :actions="false"
          @submit="submitAddProcess"
      >

        <FormKitSchema :schema="processSchema" />
<!--        <FormKit-->
<!--            id="repeater"-->
<!--            name="stages"-->
<!--            type="repeater"-->
<!--            label="Stages in the process"-->
<!--            add-label="Add a stage"-->
<!--            help="Describe the process by listing all the stages."-->
<!--        >-->
<!--          <FormKit-->
<!--              label="Stage title"-->
<!--              name="title"-->
<!--          />-->

<!--        </FormKit>-->
        <div  class="absolute right-6 bottom-0">
        <FormKit type="submit">
          <template v-if="mode === 'edit'">
            Save changes
          </template>
          <template v-else>
            <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Process
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
import { getNode } from '@formkit/core';
const client = useSupabaseClient()
const props = defineProps(['process'])

const mode = ref('add')
onMounted(async () => {
  if(props.process) {
    mode.value = 'edit'
  }
})


const submitButton = ref('Add Process')
if(mode.value === 'edit') submitButton.value = 'Save Process'

const loading = ref(true)


// Refs to the modal, to open and close them
const addProcessModal = ref('addProcessModal')
const startAddProcess = () => {
  if(mode.value === 'edit') {
    getProcess(props.process)
  }
  addProcessModal.value.open()
}

const processSchema = [
  {
    $formkit: 'text',
    name: 'name',
    label: 'Name',
    validation: 'required'
  },
  {
    $formkit: 'textarea',
    name: 'description',
    label: 'Description'
  },
  {
    $formkit: 'checkbox',
    name: 'passwordProtected',
    id: 'passwordProtected',
    value: false,
    label: 'Do you want to protect this process with a password?',
  },
  {
    $formkit: 'password',
    if: '$get(passwordProtected).value',
    name: 'password',
    label: 'Password',
    help: 'Enter your new password.',
    validation: 'length:5,16'
  }
]


async function getProcess(processId) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('processes')
        .select(`name, passwordProtected, password, description`)
        .eq('id', processId)
        .single()

    if (error && status !== 406) throw error
    if (data) {

      // if(Array.isArray(data.stages)) data.stages = data.stages.map(x => JSON.parse(x))

      getNode('addProcess').input({
        id: processId,
        name: data.name,
        description: data.description,
        password: data.password,
        passwordProtected: data.passwordProtected,
        // stages: data.stages
      })

    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}

async function submitAddProcess (newProcess) {
  const { error, data } = await client.from('processes')
      .upsert({
        id: newProcess.id,
        name: newProcess.name,
        description: newProcess.description,
        password: newProcess.password,
        passwordProtected: newProcess.passwordProtected,
        // stages: newProcess.stages
      })
      .select('name, description, password, passwordProtected')
      .single()
  if (error) {
    console.error(error);
    return;
  }
  addProcessModal.value.close()
}


</script>