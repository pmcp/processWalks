<template>
  <Ui-Button v-if="mode === 'edit'" @click="startAddAction" :light="true">
      Edit
  </Ui-Button>
  <Ui-Button v-else @click="startAddAction" >
    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    Add Action
  </Ui-Button>

  <Ui-Modal ref="addActionModal" @closed="cleanUp" @opened="prepare">
    <template v-slot:content>
      <FormKit
          type="form"
          name="addActions"
          id="addActions"
          :actions="false"
          @submit="submitAddAction"
      >
        <FormKit
            type="textarea"
            label="Description"
            name="description"
            help="What is happening in this step?"
        />
        <FormKit
            type="text"
            label="Assigned to"
            name="assignedTo"
            help="Who will be taking up this action?"
        />
        <FormKit
            type="date"
            label="Act By"
            name="actBy"
            help="When should this action be done?"
        />
        <FormKit
            type="checkbox"
            label="Done"
            name="done"
            help="Has this action been done?"
        />

        <div  class="absolute right-6 bottom-0">
          <FormKit type="submit">
            <template v-if="mode === 'edit'">
              Save changes
            </template>
            <template v-else>
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Action
            </template>
          </FormKit>
        </div>
      </FormKit>

      <Ui-Button @click="deleteAction" v-if="mode == 'edit'">
        Delete Action
      </Ui-Button>


    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'
const loading = ref(true)
const props = defineProps(['action', 'step'])
const addActionModal = ref('addActionModal')

// Supabase stuff
const client = useSupabase()

async function deleteAction() {
  // Delete the JOIN first
  await client
      .from('steps_actions')
      .delete()
      .eq('action_id', props.action.id)

  // Then delete the action
  await client
      .from('actions')
      .delete()
      .eq('id', props.action.id)

  addActionModal.value.close()
}


import { getNode } from '@formkit/core';
async function startAddAction() {
  // If edit mode, fill form with Action
  await addActionModal.value.open()
  if(mode.value === 'edit') {
    getNode('addActions').input({
      id: props.action.id,
      assignedTo: props.action.assigned_to,
      description: props.action.description,
      actBy: props.action.act_by,
      done: props.action.done,
    }).then((data) => {})
  }
}

async function submitAddAction (item) {
  // Create the action
  const { error, data } = await client.from('actions')
      .upsert({
        id: item.id,
        assigned_to: item.assignedTo,
        description: item.description,
        act_by: item.actBy,
        done: item.done,
        walk: props.step.walk
      })
      .select('id')
      .single()
  if(data) {
    // If we are editing, wee don't need to update the join table ('steps_actions')
    if(mode.value === 'edit') {
      addActionModal.value.close()
      return;
    }
    // Create the link in steps_actions
    console.log(data)
    await client.from('steps_actions')
        .upsert({
          step_id: props.step.id,
          action_id: data.id,
          walk_id: props.step.walk
        })

  }
  if (error) {
    console.error(error);
    return;
  }
  addActionModal.value.close()
}

// Editing or adding?
const mode = ref('add')
onMounted(async () => {
  if(props.action) {
    mode.value = 'edit'
  }
})

defineExpose({
  startAddAction
});

</script>