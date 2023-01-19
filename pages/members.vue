<template>
  <div class="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8 flex justify-center">
    <div class="container" v-if="!loading">
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
                <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="person in profiles" :key="person.email">
                  <td class="whitespace-nowrap px-3 text-sm text-gray-500">{{ person.email }}</td>
                  <td class="flex justify-center pt-6">
                    <FormKit
                        :value="person.admin"
                        type="checkbox"
                        name="admin"
                        :disabled="(user.id === person.id)"
                        @click="setAdmin(person.id, !person.admin)"
                    />
                  </td>
                  <td>
                    <Ui-Button :disabled="(user.id === person.id)" @click="setToRemove(person.id)" :light="true">
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
// UI Vars
const loading = ref(true)
const error = ref(true)

// Supabase stuff
const client = useSupabase();
const user = useUserStore();


// Get the Members
let profiles = ref([])
async function getProfiles () {
  loading.value = true;
  try {
    let { data, error, status } = await client
        .from('profiles')
        .select('id, email, admin, delete')
        .order('email', { ascending: false })
        .is('delete', false)
    if (error && status !== 406) throw error
    if (data) {
      console.log(data)
      profiles.value = data
    }
  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
}
await getProfiles()

async function setAdmin (profileId, val) {
  const { data, error } = await client
      .from('profiles')
      .update({ admin: val })
      .eq('id', profileId)
      .select()
}

async function setToRemove (profileId) {

  const { data, error } = await client
      .from('profiles')
      .update({ delete: true, timeOfDeletion: new Date().toISOString() })
      .eq('id', profileId)
  if (error) throw error
  if (data) {
    console.log('done deleting', data)
  }
}

// Once mounted, start tracking updates
import { RealtimeChannel } from '@supabase/supabase-js'
let profilesRealtimeChannel = RealtimeChannel
onMounted(() => {
  profilesRealtimeChannel = client
      .channel('public:[profile]')
      .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles' },
          () => getProfiles())
      .subscribe()
})
onUnmounted(() => {
  client.removeChannel(profilesRealtimeChannel)
  profiles.value = []
})



</script>