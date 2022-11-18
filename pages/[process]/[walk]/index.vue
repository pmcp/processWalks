<template>
  <!-- Primary column -->
  <section aria-labelledby="primary-heading" class="sticky top-0 flex min-w-0 flex-1 flex-col lg:order-last">
    <Steps-List :walk="route.params.walk" @editStep="editStep" @seekVideoTime="seekVideoTime"></Steps-List>
  </section>


  <!-- Secondary column (hidden on smaller screens) -->
  <aside class="hidden lg:order-first lg:block lg:flex-shrink-0 h-full">
    <div class="relative flex w-96 pr-2 flex-col border-r border-gray-200 h-full">
      <Walks-Detail ref="walkDetail" :walk="route.params.walk" :process="route.params.process"/>
    </div>
  </aside>

</template>
<script setup>
const route = useRoute()
const loaded = ref(false)

const walkDetail = ref(null)

function seekVideoTime(time) {
  console.log(time)
  walkDetail.value.seekVideoTime(time)
}


function editStep(id) {
  console.log('here', id)
  if(!walkDetail.value) return;
  walkDetail.value.startAddSteps(id)
}

</script>