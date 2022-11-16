<template>
  <Ui-Card>
    <template v-slot:header>
      <Ui-Heading>
        Personas
      </Ui-Heading>
    </template>
    <template v-slot:content>
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="(persona, key) in personas" :key="key" class="flex py-4">
          <Personas-Detail :persona="persona" />
        </li>
      </ul>
    </template>
  </Ui-Card>
</template>
<script setup>
  const props = defineProps(['personas'])

</script>