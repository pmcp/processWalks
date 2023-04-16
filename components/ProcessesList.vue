<template>
  <Ui-Heading class="mb-4">
    <span class="pr-4">
      Processes
    </span>
    <Processes-Edit></Processes-Edit>
  </Ui-Heading>
  <div v-if="processes?.length > 0" class="overflow-hidden bg-white shadow-xl sm:rounded-xl p-2 ">
    <ul role="list" class="p-2 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 divide-y divide-gray-200">

      <Processes-Detail
          v-for="process of processes"
          :process="process"
          :userId="user.id"
          :isAdmin="user.admin"
          @open="open"
      >
        <template v-slot:content>
        </template>
      </Processes-Detail>
    </ul>
  </div>
  <div v-else>
    No processes yet
  </div>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
const props = defineProps(['processes'])
const user = useUserStore();
const emit = defineEmits(['open'])
const open = (processId) => {
  emit( 'open', processId)
}
</script>