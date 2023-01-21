<template>
  <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 mb-6">
    <div class="flex flex-wrap items-center justify-between sm:flex-nowrap">
      <div>
        <span class="mr-4">Walks</span>

        <Walks-Edit :process="props.process" />
      </div>
      <div class="ml-4 mt-4 flex-shrink-0">

      </div>
    </div>
  </div>
  <div v-if="list.length > 0" class=" overflow-hidden bg-white shadow sm:rounded-md mx-6">
    <ul role="list" class="divide-y divide-gray-200">
      <li  v-for="walk of list" :key="walk.id">
        <nuxt-link :to="`/${props.process}/${walk.id}`" class="block hover:bg-gray-50">
          <div class="flex items-center px-4 py-4 sm:px-6">
            <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
              <div class="truncate">
                <div class="flex text-sm">
                  <p class="truncate font-medium text-cyan-600">{{ walk.date }}</p>
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

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
// const loading = ref(true)

// Id of [process] is passed as prop
const props = defineProps(['process'])

// Stores
import { storeToRefs } from 'pinia'
const walks = useWalksStore();
const { list } = storeToRefs(walks)

onMounted(async () => {
  walks.getWalksOfProcess(props.process)
  walks.subscribeList(props.process)
})

onUnmounted(() => {
  walks.unsubscribeList()
  walks.emptyList()
})

</script>