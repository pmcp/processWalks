import { useSupabase } from '~/composables/useSupabase.ts'
import {useWalksStore} from "~/stores/walksStore";

let realtimeChannelSteps
let realtimeChannelJoinStepsTopics
export const useStepsStore = defineStore('steps-store', () => {
    const client = useSupabase()

    const id = ref(null)
    const errorMessage = ref('')
    const timing = ref(null)


    async function get(id) {
        let {data, error, status} = await client
            .from('steps')
            .select('id, walk, timing, description, observation, topics!steps_topics(id, name, description), rating, milestone')
            .eq('id', id)
            .single()

        if (error && status !== 406) throw error
        if (data) {
            return data
        }

    }

    async function add (item, walk) {
        console.log(item, walk)
        const { error, data } = await client
            .from('steps')
            .insert({
                walk: walk,
                timing: timing.value,
                description: item.description,
                observation: item.observation,
                rating: item.rating,
                milestone: item.milestone
            })
            .select('id')
            .single()
        if (error) {
            console.error(error);
            return;
        }
        // Add Topics to Join
        if(item.topics) {
            console.log(item)
            for await (const topic of item.topics) {
                addTopicJoin(data.id, topic, walk)
            }
        }
    }

    async function edit (item, previousTopics, ) {
        console.log('editing step', item, previousTopics)
        const { error, data } = await client
            .from('steps')
            .upsert({
                id: item.id,
                walk: item.walk,
                timing: timing.value,
                description: item.description,
                observation: item.observation,
                rating: item.rating,
                milestone: item.milestone
            })
            .select('id')
            .single()
        if (error) {
            console.error(error);
            return;
        }

        console.log(item)

        if(previousTopics && previousTopics.length > 0) {
            let newList = item.topics
            let oldList = previousTopics.map(x => x.id)
            console.log('compare newList with Oldlist', newList, oldList)
            // Loop over newList, check if in oldList
            for (let i = 0; i < newList.length; i++) {
                if(oldList.includes(newList[i])) {
                    // if true: remove from oldList
                    oldList = oldList.filter(item => item !== newList[i])
                } else {
                    // if false: addTopicJoin
                    addTopicJoin(item.id, newList[i], item.walk)
                }
            }
            // Remove remaining in oldList from JOIN table
            for (let i = 0; i < oldList.length ; i++) {
                removeTopicJoin(item.id, oldList[i])
            }

        } else {
            if(item.topics) {
                for await (const topic of item.topics) {
                    console.log(data.id, topic)
                    addTopicJoin(data.id, topic, item.walk)
                }
            }
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

    async function addTopicJoin(stepId, topicId, walkId){
        console.log('adding topic join', {stepId}, {topicId}, {walkId})
        await client
            .from('steps_topics')
            .insert({
                topic_id: topicId,
                step_id: stepId,
                walk_id: walkId,
            })
            .select()
    }
    async function removeTopicJoin(stepId, topicId){
        console.log('removing topic join', {stepId}, {topicId})
        await client
            .from('steps_topics')
            .delete()
            .eq('topic_id', topicId)
            .eq("step_id", stepId)
    }

    function subscribeList(walkId){
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

    function subscribeJoinStepsTopics(walkId){
        realtimeChannelJoinStepsTopics = client
            .channel('public:[steps_topics]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'steps_topics',  filter: `walk_id=eq.${walkId}` }, payload => {
                    console.log('got a payload from subscribeJoinStepsTopics', payload, {walkId})
                    const walks = useWalksStore()
                    walks.get(walkId)
                })
            .subscribe()
    }

    function unsubscribeJoinStepsTopics(){
        client.removeChannel(realtimeChannelJoinStepsTopics)
    }

    function setCurrentTime(val) {
        timing.value = val
    }

    function setStepId(stepId){
        id.value = stepId
    }

    return { id, timing, errorMessage, setStepId, get, add, edit, remove, setCurrentTime, subscribeList, unsubscribeList, subscribeJoinStepsTopics, unsubscribeJoinStepsTopics }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStepsStore, import.meta.hot));
}
