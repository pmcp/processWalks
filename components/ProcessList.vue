<template>
  <main-modal ref="addProcessModal">
    <template v-slot:title>
      The header
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
      </FormKit>
    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </main-modal>

  <main-button @click="startAddProcess">
    Add a Process
  </main-button>

  <div v-if="processes?.length > 0" class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li  v-for="process of processes" :key="process.id">
        <NuxtLink :to="`/process/${process.id}`" class="block hover:bg-gray-50">
          <div class="flex items-center px-4 py-4 sm:px-6">
            <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
              <div class="truncate">
                <div class="flex text-sm">
                  <p class="truncate font-medium text-indigo-600">{{ process.name }}</p>
<!--                    <p class="ml-1 flex-shrink-0 font-normal text-gray-500">in {{ process.description }}</p>-->
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
        </NuxtLink>
      </li>
    </ul>
  </div>
  <div v-else>
    No processes yet
  </div>


</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
  const processSchema = [
    {
      $formkit: 'text',
      name: 'name',
      label: 'Name',
      validation: 'required'
    },
    {
      $formkit: 'text',
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



  // import { Process } from '~/types/processes'
  // import { RealtimeChannel } from '@supabase/supabase-js'

  const client = useSupabaseClient()


  const loading = ref(true)


  let realtimeChannel;

  const { data: processes, refresh: refreshProcesses } = await useAsyncData('processes', async () => {
    const { data } = await client
        .from('processes')
        .select('id, name, passwordProtected, description')
        .order('created_at', { ascending: false })
    return data
  })


    const addProcessModal = ref('addProcessModal')

const startAddProcess = () => {
  addProcessModal.value.openModal()
}


  onMounted(() => {





    // TODO: THIS IS NOT WORKING :(
    realtimeChannel = client.channel('public:processes')
        .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'processes' },
        () => refreshProcesses()
    ).subscribe()

  })
  // Don't forget to unsubscribe when user left the page
  onUnmounted(() => {
    client.removeChannel(realtimeChannel)
  })

  async function submitAddProcess (newProcess) {
    console.log(newProcess)
    const { error, data } = await client.from('processes')
        .upsert({
          name: newProcess.name,
          description: newProcess.description,
          password: newProcess.password,
          passwordProtected: newProcess.passwordProtected
        })
        .select('name, description, password, passwordProtected')
        .single()
    if (error) {
      console.error(error);
      return;
    }
    addProcessModal.value.closeModal()

    // TODO: If realtime works, remove this!
    refreshProcesses()


  }

// console.log($refs['addProcessModal'])

</script>