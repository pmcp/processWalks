<template>
  <Ui-Card>
    <template v-slot:header>
      <Ui-Heading>
        <div class="flex items-center">
          <span class="mr-4">Action Cards</span>
          <Actions-Edit ref="addEditAction" :step="props.step" :walk="props.walk" />
        </div>
      </Ui-Heading>
    </template>
    <template v-slot:content>
      <div class="h-40 w-full flex justify-center items-center" v-if="actions.length < 1">
        <p class="italic">No actions yet.</p>
      </div>
      <div v-else>
        <div class="px-6 bg-white border-b border-gray-200 pb-5 sticky top-16 z-0 pt-8 mt-8">
          <h3 class="text-lg font-medium leading-6">Active</h3>
        </div>
        <ul class="px-6">
          <li v-for="action in actionsOpen" :key="action.id">
            <Actions-Detail :step="props.step" :walk="props.walk" :action="action"></Actions-Detail>
          </li>
        </ul>

        <div class="px-6 bg-white border-b border-gray-200 pb-5 sticky top-16 z-0 pt-8 mt-8">
          <h3 class="text-lg font-medium leading-6">Done</h3>
        </div>

        <ul class="px-6">
          <li v-for="action in actionsDone" :key="action.id">
            <Actions-Detail :step="props.step" :walk="props.walk" :action="action"></Actions-Detail>
          </li>
        </ul>
      </div>
    </template>
  </Ui-Card>
</template>
<script setup>
const props = defineProps(['walk', 'step', 'actions'])

const actionsOpen = computed(() => props.actions.filter(a => !a.done || a.done === null))
const actionsDone = computed(() => props.actions.filter(a => a.done))
</script>