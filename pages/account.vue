<template>
  <Account v-if="user" />
  <Auth v-else />
</template>