<template>
  <!-- SIMPLE LAYOUT  -->
  <div v-if="walkLayout === 'simple'" class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
    <section class="sticky top-0 flex min-w-0 w-2/3 flex-col lg:order-last">
      <slot name="steps"></slot>
    </section>
    <aside class="relative hidden lg:order-first lg:block lg:flex-shrink-0 h-full w-1/3">
      <div class="absolute left-full">
        <ChevronDoubleRightIcon v-if="walkLayout === 'simple'" @click="app.setWalkLayout('videoWide')" class="top-4 fill-gray-400 relative right-2 z-10 bg-white h-5 w-5 " aria-hidden="true" />
        <ChevronDoubleLeftIcon v-if="walkLayout === 'videoWide'" @click="app.setWalkLayout('simple')" class="top-4 fill-gray-400  relative right-2 z-10 bg-white h-5 w-5 fill-rose-500" aria-hidden="true" />
      </div>
      <div class="relative flex gap-8 w-full pr-2 flex-col border-r border-gray-200 h-full">
        <div class="sticky top-5 z-10 bg-white border-b-2 border-gray-50">
          <div class="px-2 pb-4 shadow-xl rounded-lg">
            <slot name="video"></slot>
          </div>
        </div>
        <slot name="process"></slot>
      </div>
    </aside>
  </div>
  <!-- VIDEO WIDE LAYOUT  -->
  <div v-if="walkLayout === 'videoWide'" class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
    <section class="sticky top-0 flex min-w-0 flex-1 flex-col lg:order-last">
      <slot name="steps"></slot>
    </section>
    <aside class="hidden lg:order-first flex-1 lg:block lg:flex-shrink-0 h-full">
      <div class="absolute left-1/2 mr-4">
        <ChevronDoubleRightIcon v-if="walkLayout === 'simple'" @click="app.setWalkLayout('videoWide')" class="top-4 fill-gray-400 pa-4 mb-4 mr-2 relative right-2 z-10 bg-white h-5 w-5 fill-rose-500" aria-hidden="true" />
        <ChevronDoubleLeftIcon v-if="walkLayout === 'videoWide'" @click="app.setWalkLayout('simple')" class="top-4 fill-gray-400 pa-4 mb-4 mr-2 relative right-2 z-10 bg-white h-5 w-5 fill-rose-500" aria-hidden="true" />
      </div>


      <div class="relative flex gap-8 w-full pr-2 flex-col border-r border-gray-200 h-full">

        <div class="sticky top-5 z-10 bg-white border-b-2 border-gray-50">
          <div class="px-2 pb-4 shadow-xl rounded-lg">
            <slot name="video"></slot>
          </div>
        </div>
        <slot name="process"></slot>
      </div>
    </aside>
  </div>
</template>
<script setup>
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/vue/20/solid'
import {storeToRefs} from "pinia";
const app = useAppStore();
const { walkLayout } = storeToRefs(app)




</script>