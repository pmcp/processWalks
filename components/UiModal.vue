<template>
  <ClientOnly>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="close" class="relative z-40">
        <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
              class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                    as="h3"
                    class="p-6 text-lg font-medium leading-6 text-gray-900 bg-gray-200"
                >
                  <slot name="title"></slot>
                </DialogTitle>
                <div class="mt-2 p-6">
                  <slot name="content"></slot>
                </div>

                <div class="mt-4 p-6">
                  <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                      @click="close"
                  >
                    <slot name="closeButton"></slot>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const emit = defineEmits(['closed', 'opened'])


const isOpen = ref(false)

function close() {
  isOpen.value = false
}
function open() {
  isOpen.value = true
  emit('opened')
}



onMounted(() => {
  emit('opened')
})

onUnmounted(() => {
  emit('closed')
})


defineExpose({
  open,
  close
});

</script>