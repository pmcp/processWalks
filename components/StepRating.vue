<template>
    <div :class="color">
</div>


</template>
<script setup>
const props = defineProps(['rating', 'block'])

const color = computed(() => {
  const blockWeighed = props.block-6
  let classes = ''
  switch(blockWeighed) {
    case -5:
      classes = 'bg-red-600'
      break;
    case -4:
      classes = 'bg-red-500'
      break;
    case -3:
      classes = 'bg-red-400'
      break;
    case -2:
      classes = 'bg-red-300'
      break;
    case -1:
      classes = 'bg-orange-500'
      break;
    case 0:
      classes = 'bg-orange-400'
      break;
    case 1:
      classes = 'bg-orange-300'
      break;
    case 2:
      classes = 'bg-green-300'
      break;
    case 3:
      classes = 'bg-green-400'
      break;
    case 4:
      classes = 'bg-green-500'
      break;
    case 5:
      classes = 'bg-green-600'
      break;
    default:
      classes = 'bg-gray-500'
  }

  if(props.rating === blockWeighed) {
    classes = classes + ' opacity-100 h-8 w-2'
  } else {
    classes = classes + ' opacity-20 h-8 w-2'

  }

  return classes
})


</script>