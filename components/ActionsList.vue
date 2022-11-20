<template>
  <Ui-Card>
    <template v-slot:header>
      <Ui-Heading>
        <div class="flex items-center">
          <span class="mr-4">Action Cards</span>
          <Actions-Edit :step="props.step" />
        </div>
      </Ui-Heading>
    </template>
    <template v-slot:content>
      <div class="h-40 w-full flex justify-center items-center" v-if="actions.length < 1">
        <p class="italic">No actions yet</p>
      </div>
      <div v-else>
        <div class="px-6 bg-white border-b border-gray-200 pb-5 sticky top-16 z-0 pt-8 mt-8">
          <h3 class="text-lg font-medium leading-6">Active</h3>
        </div>
        <div v-if="actionsOpen.length < 1" class="h-40 w-full  p-4">
          <div class="w-full h-full rounded-lg border-4 border-dashed border-gray-200 text-gray-400 flex justify-center items-center">
            <p class="italic">No active actions</p>
          </div>
        </div>
        <ul class="px-6">
          <li v-for="action in actionsOpen" :key="action.id">
            <Actions-Detail :step="props.step" :action="action"></Actions-Detail>
          </li>
        </ul>

        <div class="px-6 bg-white border-b border-gray-200 pb-5 sticky top-16 z-0 pt-8 mt-8">
          <h3 class="text-lg font-medium leading-6">Done</h3>
        </div>

        <ul class="px-6">
          <li v-for="action in actionsDone" :key="action.id">
            <Actions-Detail :step="props.step" :action="action"></Actions-Detail>
          </li>
        </ul>
      </div>
    </template>
  </Ui-Card>
</template>
<script setup>
const props = defineProps(['step', 'actions'])

const actionsOpen = computed(() => {
    const open = props.actions.filter(a => !a.done || a.done === null)
    // console.log('open', open.length, open)
    const hasNoActByDate = open.filter(a => a.act_by === null )
    // console.log('hasNoActByDate', hasNoActByDate.length)
    const hasActByDate = open.filter(a => a.act_by !== null )
    // console.log('hasActByDate', hasActByDate.length)
    const orderByFinished = useSorted(hasActByDate, (a, b) => new Date(a.act_by) - new Date(b.act_by))

    console.log(orderByFinished.value)
  return [...orderByFinished.value, ...hasNoActByDate];
})
const actionsDone = computed(() => props.actions.filter(a => a.done))
</script>