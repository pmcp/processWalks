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
      <ul v-else>
        <li v-for="action in actions" :key="action.id">
          <Actions-Detail :step="props.step" :walk="props.walk" :action="action"></Actions-Detail>
        </li>
      </ul>
    </template>
  </Ui-Card>
</template>
<script setup>
const props = defineProps(['walk', 'step', 'actions'])
</script>