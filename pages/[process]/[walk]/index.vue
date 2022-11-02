<template>
  <!-- Primary column -->
  <section aria-labelledby="primary-heading" class="flex min-w-0 flex-1 flex-col lg:order-last">
    <steps-list process="" walk=""></steps-list>
  </section>

  <!-- Secondary column (hidden on smaller screens) -->
  <aside class="hidden lg:order-first lg:block lg:flex-shrink-0">
    <div class="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-gray-100 sticky top-0">
        Process & Walk info
    </div>
  </aside>
</template>
<script setup>

</script>