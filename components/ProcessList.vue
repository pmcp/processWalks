<template>
  <ui-modal ref="addProcessModal">
    <template v-slot:title>
      Add a Process
    </template>
    <template v-slot:content>
      <p class="text-sm text-gray-500">
        Your payment has been successfully submitted. We’ve sent you
        an email with all of the details of your order.
      </p>
      <FormKit
          type="form"
          id="addProcess"
          submit-label="Add Process"
          @submit="submitAddProcess"
      >

        <FormKitSchema :schema="processSchema" />
        <FormKit
            id="repeater"
            name="stages"
            type="repeater"
            label="Stages in the process"
            add-label="Add a stage"
            help="Describe the process by listing all the stages."
        >
          <FormKit
              label="Stage title"
              name="title"
              validation="required"
          />
        </FormKit>
      </FormKit>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </ui-modal>

  <ui-button @click="startAddProcess">
    Add a Process
  </ui-button>
  <ui-slide-over ref="slideOver" @close="closeProcessSlideOver">
    <template v-slot:title>
      {{  activeProcess.name }}
    </template>
    <template v-slot:description>
      {{  activeProcess.description }}
    </template>
    <template v-slot:walks>
      <process-walks :process="activeProcess.id" ></process-walks>
    </template>
  </ui-slide-over>
  <div v-if="processes?.length > 0" class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li
          v-for="process of processes"
          :key="process.id"
          @click="openProcessSlideOver(process)"
      >
<!--        <NuxtLink :to="`/[process]/${[process].id}`" class="block hover:bg-gray-50">-->
          <div class="flex items-center px-4 py-4 sm:px-6">
            <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
              <div class="truncate">
                <div class="flex text-sm">
                  <p class="truncate font-medium text-indigo-600">{{ process.name }}</p>
<!--                    <p class="ml-1 flex-shrink-0 font-normal text-gray-500">in {{ [process].description }}</p>-->
                </div>
                <div class="mt-2 flex">
                  <div class="flex items-center text-sm text-gray-500">
                    <p>{{ process.description }}</p>
                  </div>
                </div>
              </div>
<!--                <div class="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">-->
<!--                  <div class="flex -space-x-1 overflow-hidden">-->
<!--                    <img v-for="applicant in position.applicants" :key="applicant.email" class="inline-block h-6 w-6 rounded-full ring-2 ring-white" :src="applicant.imageUrl" :alt="applicant.name" />-->
<!--                  </div>-->
<!--                </div>-->
            </div>
            <div class="ml-5 flex-shrink-0">
              <ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
<!--        </NuxtLink>-->
      </li>
    </ul>
  </div>
  <div v-else>
    No processes yet
  </div>


</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const loading = ref(true)
const activeProcess = ref({})

// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
import ProcessWalks from "./ProcessWalks";
let realtimeChannel = RealtimeChannel

// Refs to the modal, to open and close them
const addProcessModal = ref('addProcessModal')
const startAddProcess = () => {
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

// Load the Processes
const { data: processes, refresh: refreshProcesses } = await useAsyncData('processes', async () => {
  const { data } = await client
      .from('processes')
      .select('id, name, passwordProtected, description')
      .order('created_at', { ascending: false })
  return data
})

// Open Slide Over Menu
const slideOver = ref('slideOver')

const openProcessSlideOver = (process) => {
  // Set the [process] id, so Walks can be loaded
  console.log(process)
  activeProcess.value = process
  slideOver.value.open()
}

const closeProcessSlideOver = () => {
  // The closing itself is done from the component, we just need to clear the active [process]
  activeProcess.value = {}
}

onMounted(() => {
  realtimeChannel = client
    .channel('public:[process]')
    .on(
      'postgres_changes',
        { event: '*', schema: 'public', table: 'processes' },
      () => refreshProcesses())
    .subscribe()
  })

async function submitAddProcess (newProcess) {
  console.log(newProcess)
  const { error, data } = await client.from('processes')
    .upsert({
      name: newProcess.name,
      description: newProcess.description,
      password: newProcess.password,
      passwordProtected: newProcess.passwordProtected,
      stages: newProcess.stages
    })
    .select('name, description, password, passwordProtected, stages')
    .single()
  if (error) {
    console.error(error);
    return;
  }
  addProcessModal.value.close()
}


onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  processes.value = []
})

</script>