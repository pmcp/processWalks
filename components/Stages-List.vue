<template>
  <Ui-Card>
    <template v-slot:header>
      <Ui-Heading>
        Stages
      </Ui-Heading>
    </template>
    <template v-slot:content>
      <ul role="list" class="divide-y divide-gray-200">
        <li class="flex py-4" v-for="(stage, key) in stages" :key="key">
            <p class="text-sm font-medium text-gray-900">{{ stage.title }}</p>
        </li>
      </ul>
    </template>
  </Ui-Card>
</template>
<script setup>
const props = defineProps(['stages'])
</script>