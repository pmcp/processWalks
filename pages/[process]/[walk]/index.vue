<template>
  <!-- Primary column -->
  <section aria-labelledby="primary-heading" class="flex min-w-0 flex-1 flex-col lg:order-last">
    <Steps-List process="" walk=""></Steps-List>
  </section>

  <!-- Secondary column (hidden on smaller screens) -->
  <aside class="hidden lg:order-first lg:block lg:flex-shrink-0">
    <div class="relative flex w-96 flex-col  border-r border-gray-200 ">
      <Walks-Detail :walk="route.params.walk" :process="route.params.process" />
    </div>
  </aside>
</template>
<script setup>
const route = useRoute()
</script>