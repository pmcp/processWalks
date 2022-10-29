<template>
  <div class="container" >
    <div>pos: {{x}}, {{y}}</div>
    <Account v-if="user" />
    <Auth v-else />

  </div>
</template>

<script setup>
const user = useSupabaseUser()
const { x, y } = useMouse()
</script>