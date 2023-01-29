import { useSupabase } from '~/composables/useSupabase.ts'
import {storeToRefs} from "pinia";


//
//
// function dynamicSort(property) {
//     var sortOrder = 1;
//     if(property[0] === "-") {
//         sortOrder = -1;
//         property = property.substr(1);
//     }
//     return function (a,b) {
//         /* next line works with strings and numbers,
//          * and you may want to customize it to your needs
//          */
//         var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
//         return result * sortOrder;
//     }
// }



let realtimeChannelSteps
export const useActionsStore = defineStore('actions-store', () => {
    const client = useSupabase()

    async function getVideoUrl(video){
        const videoUrl = await client
            .storage
            .from('movies')
            .createSignedUrl(video, 3600)
        return videoUrl.data.signedUrl

    }
    // ...Until here

    const list = ref([])
    async function getAll (admin) {
        try {

            if(admin) {

                let { data, error } = await client
                    .from('actions')
                    .select('id, assigned_to, description, act_by, done, hidden, walk(id, date, video, process, personas!walks_personas(id, description), delete, process(id, name, passwordProtected, description, delete, profiles!profi_proc(id, email)), steps!steps_actions(id, description, rating, milestone, observation, timing, topics!steps_topics(id, name, description))), steps!steps_actions(id, description, rating, milestone, observation, timing, topics!steps_topics(id, name, description))')
                    .order('act_by', { ascending: false })
                if (error) throw error
                console.log(error)
                if (data) {
                    console.log(data)
                    list.value = data
                    return;
                }
            } else {
                let { data, error } = await client
                    .from('actions')
                    .select('id, assigned_to, description, act_by, done, hidden, walk(id, date, video, process, personas!walks_personas(id, description), delete, process(id, name, passwordProtected, description, delete, profiles!profi_proc(id, email)), steps!steps_actions(id, description, rating, milestone, observation, timing, topics!steps_topics(id, name, description))), steps!steps_actions(id, description, rating, milestone, observation, timing, topics!steps_topics(id, name, description))')
                    .neq('hidden', true)
                    .order('act_by', { ascending: false })
                if (error) throw error
                console.log(error)
                if (data) {
                    console.log(data)
                    list.value = data
                    return;
                }
            }


        } catch (error) {
            console.log(error)
            error.value = error.message
        } finally {

        }
    }
    function subscribeList(walkId){
        realtimeChannelSteps = client
            .channel('public:[actions]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'actions', filter: `walk=eq.${walkId}` },payload => {
                    console.log('got a payload from subscribeList', payload)
                    const walks = useWalksStore()
                    walks.get(walkId)
                })
            .subscribe()
    }

    function unsubscribeList(){
        client.removeChannel(realtimeChannelSteps, subscribeList, unsubscribeList)
    }

    return { list, getVideoUrl, getAll, subscribeList, unsubscribeList }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useActionsStore, import.meta.hot));
}
