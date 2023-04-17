<template>
  <!-- MOBILE LAYOUT  -->
  <div class="block sm:hidden pt-4">
    <div class="relative flex gap-8 w-full pr-2 flex-col border-r border-gray-200 h-full">
      <div class="sticky top-5 z-10 bg-white border-b-2 border-gray-50">
        <div class="px-2 pb-4 shadow-xl rounded-lg">
          <slot name="video"></slot>
        </div>
      </div>
      <slot name="process"></slot>
    </div>
    <slot name="steps" :layout="'mobile'"></slot>
  </div>
  <div class="hidden sm:block">
    <!-- SIMPLE LAYOUT  -->
    <div v-if="walkLayout === 'simple'" class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
      <aside class="relative  lg:flex-shrink-0 h-full w-1/3">

        <div class="relative flex gap-8 w-full pr-2 flex-col border-r border-gray-200 h-full">
          <div class="flex absolute top-2 right-2 z-40">
            <ChevronDoubleRightIcon @click="app.setWalkLayout('videoWide')" class="fill-gray-400 relative right-2 z-10 bg-white h-5 w-5 " aria-hidden="true" />
          </div>
          <div class="sticky top-5 z-10 bg-white border-b-2 border-gray-50">
            <div class="px-2 pb-4 shadow-xl rounded-lg">
              <slot name="video"></slot>
            </div>
          </div>
          <slot name="process"></slot>
        </div>
      </aside>
      <section class="sticky top-0 flex min-w-0 w-2/3 flex-col lg:order-last">
        <slot name="steps" :layout="walkLayout"></slot>
      </section>

    </div>
    <!-- VIDEO WIDE LAYOUT  -->
    <div v-if="walkLayout === 'videoWide'" class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
      <aside class="relative flex-1 lg:block lg:flex-shrink-0 h-full">
        <div class="flex absolute top-2 right-2 z-40">

          <ChevronDoubleLeftIcon @click="app.setWalkLayout('simple')" class=" fill-gray-400 pa-4 mb-4 mr-2 relative right-2 z-10 bg-white h-5 w-5 " aria-hidden="true" />
          <ChevronDoubleRightIcon @click="app.setWalkLayout('videoFull')" class=" fill-gray-400  relative right-2 z-10 bg-white h-5 w-5 " aria-hidden="true" />
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
      <section class="sticky top-0 flex min-w-0 flex-1 flex-col lg:order-last">
        <slot name="steps" :layout="walkLayout"></slot>
      </section>

    </div>
    <!-- VIDEO FULL LAYOUT  -->
    <div v-if="walkLayout === 'videoFull'" class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
      <aside class="relative w-3/4 lg:block lg:flex-shrink-0 h-full">
        <div class="flex absolute top-2 right-2 z-40 top-0 ">
          <ChevronDoubleLeftIcon @click="app.setWalkLayout('videoWide')" class=" fill-gray-400 pa-4 mb-4 mr-2 relative right-2 z-10 bg-white h-5 w-5 " aria-hidden="true" />
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
      <section class="sticky top-0 flex min-w-0 flex-1 flex-col lg:order-last">
        <slot name="steps" :layout="walkLayout"></slot>
      </section>

    </div>


  </div>

</template>
<script setup>
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/vue/20/solid'
import {storeToRefs} from "pinia";
const app = useAppStore();
const { walkLayout } = storeToRefs(app)




</script>