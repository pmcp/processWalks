<template>
  <div class="bg-gray-50 px-4 py-6 sm:px-6 sm:rounded-t-lg">
    <div class="flex flex-col h-full justify-between">
      <div class="flex items-center justify-between w-full">
        <span class="mr-4">{{  process.name }}</span>
        <Processes-Edit v-if="isAdmin" :process="process.id"/>
      </div>
      <div class="whitespace-pre-wrap w-full text-sm text-gray-500 pb-5">{{ process.description }}</div>
      <slot name="content"/>
      <Ui-Button
          @click="open(process.id)"
          v-if="process.walks"
            :light="true" class="flex justify-between w-full"
          :disabled="!inProfile"
      >
        Walks: {{ process.walks.length }}
        <ChevronRightIcon v-if="inProfile" class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </Ui-Button>

    </div>
  </div>
</template>
<script setup>
  import { ChevronRightIcon } from '@heroicons/vue/20/solid'
  const props = defineProps(['process', 'userId', 'isAdmin'])

  const emit = defineEmits(['open'])
  const open = (processId) => {
    emit( 'open', processId)
  }

  // check if profile id is in profiles of process
  const inProfile = ref(false)

  function checkIfAccessToProcess(userId, isAdmin, processesIds) {
console.log(userId, isAdmin, processesIds)
    if(isAdmin) return true
    return processesIds.includes(userId)
  }

  // console.log(props.user.admin, props.process.profiles)

  console.log(props)
  if(props.process.profiles) {
    inProfile.value = checkIfAccessToProcess(props.userId, props.isAdmin, props.process.profiles.map(x => x.id))
  }
  watch(() => props.userId, (first, second) => {
    inProfile.value = checkIfAccessToProcess(props.userId, props.isAdmin, props.process.profiles.map(x => x.id))
    console.log(
        "Watch props.selected function called with args:",
        first,
        second
    );
  });
</script>