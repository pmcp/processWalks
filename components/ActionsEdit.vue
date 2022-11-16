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

    </template>
    <template v-slot:closeButton>
      Close
    </template>
  </Ui-Modal>

</template>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid'

import { getNode } from '@formkit/core';

// Supabase stuff
const client = useSupabaseClient()
import { RealtimeChannel } from '@supabase/supabase-js'
let realtimeChannel = RealtimeChannel

const props = defineProps(['action', 'step', 'mode', 'walk'])

const addActionModal = ref('addActionModal')
const loading = ref(true)

const mode = ref('add')

async function startAddAction() {
  // If edit mode, fill form with Action
  console.log(props.action)
  await addActionModal.value.open()
  if(mode.value === 'edit') {
    getNode('addActions').input({
      id: props.action.id,
      assignedTo: props.action.assigned_to,
      description: props.action.description,
      actBy: props.action.act_by
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
        act_by: item.actBy
      })
      .select('id, assigned_to, description, act_by')
      .single()
  if(data) {
    if(mode === 'edit') return
    // Create the link in steps_actions
    await client.from('steps_actions')
        .upsert({
          step_id: props.step,
          action_id: data.id,
          walk_id: props.walk
        })
        .select()
        .single()
  //  TODO: Reload walk efficiently?
  }
  if (error) {
    console.error(error);
    return;
  }
  addActionModal.value.close()
}


// To convert seconds to time
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function convertMsToTime(secs) {
  if(!secs) return '00:00:00.000'
  console.log(secs.toString())
  let milliseconds = (secs.toFixed(3).toString()).split('.', 2);
  let milli = milliseconds[1]
  console.log(milli)
  let seconds = Math.floor(secs)
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;


  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds)}.${milli}`;
}

onMounted(async () => {
  if(props.action) {
    mode.value = 'edit'
  }

})

defineExpose({
  startAddAction
});

</script>