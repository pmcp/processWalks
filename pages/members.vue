<template>
  <div class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
    <div class="container">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th scope="col" class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Admin</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Delete</span>
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 ">
                <tr v-for="person in list" :key="person.id">
                  <td class="whitespace-nowrap px-3 text-sm text-gray-500">{{ person.email }}</td>
                  <td class="flex justify-center pt-6">
                    <FormKit
                        v-model="person.admin"
                        type="checkbox"
                        decorator-icon="check"
                        name="admin"
                        :disabled="(user.id === person.id)"
                        @click="members.makeAdmin(person.id, !person.admin)"
                    />
                  </td>
                  <td>
                    <Ui-Button :disabled="(user.id === person.id)" @click="members.remove(person.id)" :light="true">
                      Delete
                    </Ui-Button>
                  </td>

                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//  Store Stuff
const user = useUserStore();
const members = useMembersStore();

const list = computed(() => members.list)

// Get the Members
await members.getAll()

onMounted(() => {
  members.subscribe()
})
onUnmounted(() => {
  members.unsubscribe()
})

</script>