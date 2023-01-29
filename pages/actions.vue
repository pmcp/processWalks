<template>

  <div class="min-h-screen bg-gray-100">
    <div class="py-6">
      <div class="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8 ite">
        <div class="hidden lg:col-span-3 lg:block xl:col-span-2">
          <FormKit
              type="checkbox"
              decorator-icon="check"
              label="Only Milestones"
              name="milestones"
              v-model="checkMilestones"
              ref="milestonesCheck"
          />


        </div>

        <main class="lg:col-span-9 xl:col-span-6 grid gap-4">

          <div v-for="action in filteredList">

              <action-card :action="action" @open="open">
                <template v-slot:cardButton>
                  <Ui-Button class="absolute right-0 bottom-0 mr-4 mb-8" :light="true" @click="open(action)">
                    Show Details <ChevronRightIcon class="ml-2 h-5 w-5 fill-gray-500" aria-hidden="true" />
                  </Ui-Button>
                </template>
              </action-card>

          </div>

        </main>

<!--                <pre>{{ walk.steps[0].timing }}</pre>-->
        <aside v-if="walk" class="xl:col-span-4 block">

          <div class="sticky top-6 space-y-4">
            <div class="sticky top-5 z-10 bg-white border-b-2 border-gray-50">
              <div class="px-2 pt-2 pb-4 shadow-xl rounded-lg">
                <div v-if="videoUrl">
                  <Player :video="videoUrl" :startTime="walk.steps[0].timing"  ref="videoPlayer" />
                </div>
              </div>
              <div class=" sm:rounded-t-lg">
                <div class="flex flex-col h-full justify-between">
<!--                  <StarIcon v-if="walk.steps[0].milestone" class="pt-1 mr-2 h-5 w-5 fill-cyan-500" aria-hidden="true" />-->

                  <br>
                  <div class="flex flex-col ">
                    <div class="p-4 flex flex-col gap-4">
                      <div class="flex flex-col gap">
                        <p class="text-sm font-medium text-gray-900">Step Description</p>
                        <p class="text-sm font-medium text-gray-500">{{  walk.steps[0].description }}</p>
                      </div>
                      <div class="flex flex-col gap">
                        <p class="text-sm font-medium text-gray-900">Step Observation</p>
                        <p class="text-sm font-medium text-gray-500">{{ walk.steps[0].description }}</p>
                      </div>
                    </div>


                    <div class="bg-gray-200 rounded shadow-lg p-4 m-4 flex flex-col gap-4">
                      <div class="flex flex-col gap">
                        <p class="text-sm font-medium text-gray-900">Process</p>
                        <p class="text-sm font-medium text-gray-500">{{ walk.walk.process.name }}</p>
                      </div>
                      <div class="flex flex-col gap">
                        <p class="text-sm font-medium text-gray-900">Process Description</p>
                        <p class="text-sm font-medium text-gray-500">{{  walk.walk.process.description }}</p>
                      </div>
                      <div class="flex flex-col gap">
                        <p class="text-sm font-medium text-gray-900">Process Description</p>
                        <p class="text-sm font-medium text-gray-500">{{ walk.walk.date }}</p>
                      </div>
                    </div>

                  </div>

                  <br>


<!--                  <pre>{{ walk.steps[0]}}</pre>-->
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>

</template>
<script setup>
import { StarIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
const actions = useActionsStore();

import { storeToRefs } from 'pinia'
const videoPlayer = ref(null);
const { list } = storeToRefs(actions)

const user = useUserStore();
const { admin } = storeToRefs(user)


await actions.getAll(admin)


const checkMilestones = ref(false)


const filteredList = computed(() => {
  let filteringList = list.value
  if(checkMilestones.value) {
    console.log(list.value)
    filteringList = list.value.filter(x => {
      console.log(x.steps[0].milestone, x)
      if(x.steps[0].milestone) return x
    })
    console.log(filteringList)
  }

  return filteringList
})


const walk = ref(null)
const videoUrl = ref(null)
async function open(data) {
  const url = await actions.getVideoUrl(data.walk.video)
  videoUrl.value = url
  walk.value = data

}

</script>