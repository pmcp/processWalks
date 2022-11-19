<template>
  <div class="whitespace-nowrap px-2 py-1 text-center rounded-xl mb-2 text-xs font-medium bg-rose-100 text-gray-900">{{ p }}</div>
</template>
<script setup>
const client = useSupabaseClient()
const props = defineProps(['topic'])
const loading = ref(true)
const p = ref({})

// Get Topic
async function getTopic(id) {
  loading.value = true
  try {
    let { data, error, status } = await client
        .from('topics')
        .select(`name, description`)
        .eq('id', id)
        .single()

    if (error && status !== 406) throw error
    if (data) {
      p.value = data.name
    }
  } catch (error) {
    console.log(error)

  } finally {
    loading.value = false
  }
}

getTopic(props.topic)

</script>