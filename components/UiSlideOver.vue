<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-20" @close="isOpen = false">
      <div class="fixed inset-0" />
      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="absolute right-0 mr-10 mt-6 flex  items-center z-30">
                    <Ui-Button @click="isOpen = false" :light="true">Close</Ui-Button>

                  </div>
                  <slot />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const isOpen = ref(false)

function close() {
  isOpen.value = false
}
function open() {
  isOpen.value = true
}


defineExpose({
  open,
  close
});

// Emits function when SlideOver is closed
const emit = defineEmits(['close'])
emit('close')

</script>