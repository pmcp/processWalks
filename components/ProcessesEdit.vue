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
          #default="{ value }"
          id="addProcess"
          name="addProcess"
          :actions="false"
          @submit="submitAddProcess"
      >

        <FormKitSchema :schema="processSchema" />
        <FormKit
            type="autocomplete"
            name="members"
            label="Search and select multiple members"
            :options="members"
            selection-appearance="text-input"
            multiple

        />
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
      <Ui-Button @click="removeProcess" v-if="mode == 'edit'">
        Delete Process
      </Ui-Button>
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



async function getProcess(processId) {
  loading.value = true

  try {
    let { data, error, status } = await client
        .from('processes')
        .select(`id, name, passwordProtected, password, description, profiles!profi_proc(id, email)`)
        .eq('id', processId)
        .single()

    if (error && status !== 406) throw error
    if (data) {


      const members = data.profiles.map((member) => {
        return member.id
      })

      getNode('addProcess').input({
        id: processId,
        name: data.name,
        description: data.description,
        password: data.password,
        passwordProtected: data.passwordProtected,
        members
        // stages: data.stages
      })

    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}


const members = ref([])
async function getProfiles () {
  loading.value = true;
  try {
    let { data, error, status } = await client
        .from('profiles')
        .select('id, email')
        .order('email', { ascending: false })
        .is('delete', false)
    if (error && status !== 406) throw error
    if (data) {

      members.value = data.map((member) => {
        return { value: member.id, label: member.email }
      })

    }
  } catch (error) {
    console.log(error)
    error.value = error.message
  } finally {
    loading.value = false
  }
}
await getProfiles()



// Update project so it is flagged as deleted
async function removeProcess () {
  const {error, data} = await client.from('processes')
      .update({delete: true, timeOfDeletion: new Date().toISOString()})
      .eq('id', props.process)
  if (error) {
    console.error(error);
    return;
  }
  addProcessModal.value.close()
}



async function submitAddProcess (newProcess) {
  const { error, data } = await client.from('processes')
      .upsert({
        id: newProcess.id,
        name: newProcess.name,
        description: newProcess.description,
        password: newProcess.password,
        passwordProtected: newProcess.passwordProtected,
        delete: false
        // stages: newProcess.stages
      })
      .select('id', 'name, description, password, passwordProtected')
      .single()
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const projectId = data.id
    let membersToSave = newProcess.members
    // Get existing connections
    try {
      let { data, error, status } = await client
          .from('profi_proc')
          .select('profi_id')
      if (error) throw error
      if (data) {
        const membersInJoin = data.map((item) => {
          return item.profi_id
        })

        for (let i = 0; i < membersInJoin.length; i++) {
          // Check if existing join is in membersToSave
          if(membersToSave.includes(membersInJoin[i])) {
            // If yes, remove item from membersToSave
            membersToSave = membersToSave.filter(item => item === membersInJoin[i])
          } else {
            // If no, delete join
            const { error } = await client
              .from('profi_proc')
              .delete()
              .eq('profi_id', membersInJoin[i])
          }
        }

        // If membersToSave > 0, add membersToSave as JOIN
        if(membersToSave.length > 0) {
          for (let i = 0; i < membersToSave.length; i++) {
            await client.from('profi_proc')
                .insert({
                  profi_id: membersToSave[i],
                  proc_id: projectId
                })
          }
        }
      }
    } catch (error) {
      console.log(error)
      error.value = error.message
    } finally {
      loading.value = false
    }



    // Check if there
    if(newProcess.members.length < 1) return;
    for (let i = 0; i < newProcess.members.length; i++) {
      const memberId = newProcess.members[i]
      // Save Members as JOIN table
      //  TODO: what if members get deleted


      await client.from('profi_proc')
        .insert({
          profi_id: memberId,
          proc_id: projectId
        })

    }


  }
  addProcessModal.value.close()
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
  },
  // {
  //   $formkit: 'autocomplete',
  //   name: 'autocomplete',
  //   label: 'Members',
  //   help: 'Select members who can view this project',
  //   options: [],
  //   selectionAppearance: 'option',
  //   multiple: true
  // }
]
</script>