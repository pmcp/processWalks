<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg ">
    <slot name="header"/>
  </div>
  <div class="bg-gray-50 px-6 border border-gray-50 ">
    <slot name="content"/>
  </div>
</template>