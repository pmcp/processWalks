<template>
    <div class="h-8 w-2" :style="color">
</div>


</template>
<script setup>
const props = defineProps(['rating', 'block'])

const color = computed(() => {
  const blockWeighed = props.block-5
  let style = ''
  switch(blockWeighed) {
    case -4:
      style = 'background-color:#E63946'
      break;
    case -3:
      style = 'background-color:#D67078'
      break;
    case -2:
      style = 'background-color:#D69599'
      break;
    case -1:
      style = 'background-color:#DFB8BB'
      break;
    case 0:
      style = 'background-color:#BBBBBB'
      break;
    case 1:
      style = 'background-color:#9DCCB8'
      break;
    case 2:
      style = 'background-color:#6FC09D'
      break;
    case 3:
      style = 'background-color:#4FA881'
      break;
    case 4:
      style = 'background-color:#0D8953'
      break;
    default:
      style = 'background-color:#BBBBBB'
  }

  if(props.rating === blockWeighed) {
    style = style + ';opacity:1'
  } else {
    style = style + ';opacity:.1;'

  }

  return style
})


</script>