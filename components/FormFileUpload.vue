<template>
  <Ui-Button :light="!empty">
    <label class="button primary block" for="single">
      <template v-if="empty">
        {{ uploading ? "Uploading ..." : "Add video" }}
      </template>
      <template v-else>
      {{ uploading ? "Uploading ..." : "Change video" }}
      </template>
    </label>
    <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="video/*"
        @change="upload"
        :disabled="uploading"
    />
  </Ui-Button>
</template>


<script setup>
const client = useSupabaseClient()

const emit = defineEmits(['upload'])
const uploading = ref(false)
const files = ref()

const props = defineProps(['light', 'empty'])

const upload = async (evt) => {
  files.value = evt.target.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select a video to upload.')
    }
    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${Math.random()}.${fileExt}`
    let { error: uploadError } = await client.storage.from('movies').upload(filePath, file)
    if (uploadError) throw uploadError
    emit( 'upload', filePath)
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

</script>