<template>
  <User-Account v-if="user" />
  <User-Auth v-else />
</template>