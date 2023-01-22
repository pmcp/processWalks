<template>
  <div>
    <div class="min-h-full">
      <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <div class="hidden md:block">
                <div class="flex items-baseline space-x-4">
                  <div v-for="n in nav" :key="n.name">
                    <a v-if="!n.admin || user && user.admin" :href="n.href" :class="[n.href == route.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']" :aria-current="n.current ? 'page' : undefined">
                      {{ n.name }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    <span v-if="user.id != null">
                      Sign out
                    </span>
                    <span v-else>
                      Sign in
                    </span>
                    <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div v-if="user.id != null" class="py-1">
                      <div class="p-4 text-xs">Signed in with {{ user.email }}</div>
                      <button @click="user.signOut" class="hover:underline" :class="[user.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                        Sign out
                      </button>
                    </div>
                    <div v-else class="p-4">
                      <FormKit
                          type="form"
                          name="signIn"
                          id="signIn"
                          submit-label="Sign in"
                          @submit="user.signIn"
                      >
                        <FormKit
                            type="email"
                            label="Email"
                            name="email"
                            validation="required|email"
                            help="Please enter your email address."
                            validation-visibility="live"
                        />
                      </FormKit>
                      <div v-if="user.message" class="bg-gray-300 p-2 text-gray-800 rounded">
                        <span class="text-sm">{{ user.message }}</span>
                      </div>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>

            </div>
            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <DisclosureButton class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="sr-only">Open main menu</span>
                <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <!-- Mobile -->
        <DisclosurePanel class="md:hidden">
          <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <DisclosureButton v-for="item in nav" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
          </div>
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex ">
              <div class="m-4 rounded bg-gray-200 w-full">
                <div v-if="user.id != null" class="py-1 w-full p-4">
                  <div class="text-lg w-full pb-2 mb-4 border-b border-gray-400">Sign out</div>
                  <div class="p-4 text-xs">Signed in with {{ user.email }}</div>
                  <button @click="user.signOut" class="hover:underline" :class="[user.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full px-4 py-2 text-left text-sm']">
                    Sign out
                  </button>
                </div>
                <div v-else class="p-4">
                  <div class="text-lg w-full pb-2 mb-4 border-b border-gray-400">Sign in</div>
                  <FormKit
                      type="form"
                      name="signIn"
                      id="signIn"
                      submit-label="Sign in"
                      @submit="user.signIn"
                  >
                    <FormKit
                        type="email"
                        label="Email"
                        name="email"
                        validation="required|email"
                        help="Please enter your email address."
                        validation-visibility="live"
                    />
                  </FormKit>
                  <div v-if="user.message" class="bg-gray-300 p-2 text-white rounded">
                    <span class="text-sm">{{ user.message }}</span>
                  </div>
                </div>
              </div>



            </div>

          </div>
        </DisclosurePanel>
      </Disclosure>
      <main>
        <slot />
      </main>
    </div>
  </div>

</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

// Nuxt stuff
const route = useRoute()
// Stores
import { storeToRefs } from 'pinia'
const app = useAppStore();
const user = useUserStore();

const { nav } = storeToRefs(app)
const { id, admin, message } = storeToRefs(user)

// Sign in


onMounted(async () => {
  await user.getUser()
  await user.watchSession()
})



</script>