<template>
  <p class="text-gray-900">{{ p.description }}</p>
</template>
<script setup>
const client = useSupabase()
const props = defineProps(['persona'])
const loading = ref(true)
const p = ref({})

// Get Persona
async function getPersona(id) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('personas')
        .select(`description`)
        .eq('id', id)
        .single()

    if (error && status !== 406) throw error
    if (data) {
      p.value = data.description
    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}

getPersona(props.persona)

</script>