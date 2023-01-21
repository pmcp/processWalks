import { useSupabase } from '~/composables/useSupabase.ts'
import {useWalksStore} from "~/stores/walksStore";

let realtimeChannelSteps
export const useStepsStore = defineStore('steps-store', () => {
    const client = useSupabase()

    const id = ref(null)
    const errorMessage = ref('')
    const timing = ref(null)


    async function get(id) {
        let {data, error, status} = await client
            .from('steps')
            .select('id, timing, description, observation, topics!steps_topics(id, name, description), rating, milestone')
            .eq('id', id)
            .single()

        if (error && status !== 406) throw error
        if (data) {
            return data
        }

    }

    async function add (item) {
        const { error, data } = await client.from('steps')
            .upsert({
                id: item.id,
                walk: props.walk,
                timing: stepTiming.value,
                description: item.description,
                observation: item.observation,
                topics: item.topics,
                rating: item.rating,
                milestone: item.milestone
            })
        if (error) {
            console.error(error);
            return;
        }

    }

    async function remove(stepId) {
        const { error } = await client
            .from('steps')
            .delete()
            .eq('id', stepId)
        if(error) {
            console.log(error.code)
            if(error.code == 23503) {
                console.log('setting errorMessage')
                errorMessage.value = 'There are still action cards connected with this step. Delete these first.'
            }
        } else {
            return
        }
    }

    function subscribeList(walkId){
        // TODO: Still getting doubles, fix
        realtimeChannelSteps = client
            .channel('public:[steps]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'steps', filter: `walk=eq.${walkId}`},payload => {
                    console.log('got a payload from subscribeList', payload)
                    const walks = useWalksStore()
                    walks.get(walkId)
                })
            .subscribe()
    }

    function unsubscribeList(){
        client.removeChannel(realtimeChannelSteps, subscribeList, unsubscribeList)
    }

    function setCurrentTime(val) {
        timing.value = val
    }

    function setStepId(stepId){
        id.value = stepId
    }

    return { id, timing, errorMessage, setStepId, get, add, remove, setCurrentTime, subscribeList, unsubscribeList }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStepsStore, import.meta.hot));
}
