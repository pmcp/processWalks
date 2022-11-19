<template>
  <div v-for="action in actions" :key="action.id">
    {{ action }}
  </div>

</template>
<script setup>
const loading = ref(false)
const client = useSupabaseClient()

const actions = ref(null)

// Load the Actions
async function getActions () {
  loading.value = true;
  try {
    let { data, error, status } = await client
        .from('actions')
        .select('id, created_at, assigned_to, act_by, description, done, walks!steps_actions(id, video, personas, processes(id, name, passwordProtected, description), steps!steps_actions(id, description, timing, milestone, observation, topics, rating))')
        .order('created_at', { ascending: false })
    if (error && status !== 406) throw error
    if (data) {
      console.log(data)
      actions.value = data
    }
  } catch (error) {
    console.log(error)
    // alert(error.message)
  } finally {}
}
getActions()


</script>