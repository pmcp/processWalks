<template>
  <Ui-Loading v-if="loading"/>
  <template v-else>
    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 mb-6">
      <div class="flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div>
          <span class="mr-4">Walks</span>
          <Walks-Edit :process="props.process"></Walks-Edit>
        </div>
        <div class="ml-4 mt-4 flex-shrink-0">
        </div>
      </div>
    </div>
    <div v-if="walks?.length > 0" class=" overflow-hidden bg-white shadow sm:rounded-md mx-6">
      <ul role="list" class="divide-y divide-gray-200">
        <li  v-for="walk of walks" :key="walk.id">
          <nuxt-link :to="`/${props.process}/${walk.id}`" class="block hover:bg-gray-50">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div class="truncate">
                  <div class="flex text-sm">
                    <p class="truncate font-medium text-rose-600">{{ walk.date }}</p>
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
      <div class=" px-4 py-4 sm:px-6 text-gray-500">
        No walks yet
      </div>
    </div>
  </template>


</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const loading = ref(true)
const client = useSupabase()

import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

// Id of [process] is passed as prop
const props = defineProps(['process'])

// Load the Walks
const walks = ref([])
async function getWalks(id) {
  try {
    let { data, error, status } = await client
        .from('walks')
        .select('id, date, personas, video')
        .eq('process', id)
        .order('date', { ascending: false })
    if (error && status !== 406) throw error
    if (data) {
      walks.value = data
    }
  } catch (error) {
    alert(error.message)
  } finally {}
}

onMounted(async () => {
  loading.value = true
  getWalks(props.process);
  // Subscribe to changes of Walks
  realtimeChannel = client.channel('public:[walk]').on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'walks' },
      () => getWalks(props.process)
  ).subscribe()
  loading.value = false
})

onUnmounted(() => {
  client.removeChannel(realtimeChannel)
  walks.value = []
})

</script>