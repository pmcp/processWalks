import { useSupabase } from '~/composables/useSupabase.ts'

// Hot reload


let realtimeChannelWalksOfProcess
let realtimeChannelSingleWalk
let realtimeChannelJoinWalksPersonas
let realtimeChannelJoinWalksActions

export const useWalksStore = defineStore('walks-store', () => {
    const client = useSupabase()
    const realTimeChannelSingle = ref()
    const realTimeChannelList = ref()
    const list = ref([])
    const single = ref(null)

    async function getWalksOfProcess(processId) {
        console.log('gonna get walks of process', {processId})
        try {
            const { data, error } = await client
                .from('walks')
                .select('id, date')
                .eq('process', processId)
                .order('date', { ascending: false })
            .is('delete', false)
            if (error) console.log(error)
            if (data) {
                console.log(data)
                list.value = data
                return;
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    async function get(walkId) {
        console.log('going to get walk', {walkId})
        try {
            let { data, error, status } = await client
                .from('walks')
                .select(`id, date, video, personas!walks_personas(id, description), processes(id, description, name), steps!steps_walk_fkey(id, walk, description, timing, observation, milestone, topics!steps_topics(id, name, description), rating, actions(id, description, act_by, done, walk, assigned_to, hidden))`)
                .eq('id', walkId)
                .single()
            if (error && status !== 406) throw error
            if (data) {
                console.log('going to get video url', data.video)
                if(data.video) {
                    const videoUrl = await client
                        .storage
                        .from('movies')
                        .createSignedUrl(data.video, 3600)
                    data.videoTempUrl = videoUrl.data.signedUrl
                }
                single.value = data
                return data
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    function subscribeList(processId){
        console.log('subscribing', {processId})
        realtimeChannelWalksOfProcess = client
            .channel('public:[walks]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'walks' }, payload => {
                    console.log('got a payload from subscribeList', payload)
                    getWalksOfProcess(processId)
                })
            .subscribe()
    }

    function unsubscribeList(){
        client.removeChannel(realtimeChannelWalksOfProcess)
    }

    function subscribeSingle(walkId){
        console.log('subscribe to walk', walkId)
        realtimeChannelSingleWalk = client
            .channel('public:[walks]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'walks', filter: `id=eq.${walkId}` }, payload => {
                    console.log('got a payload from subscribeSingle', payload)
                    get(walkId)
                })
            .subscribe()

    }

    function unsubscribeSingle(){
        console.log('UNSUBSCRIBE walk')
        client.removeChannel(realtimeChannelSingleWalk)
    }

    function subscribeJoinWalksPersonas(walkId){
        realtimeChannelJoinWalksPersonas = client
            .channel('public:[walks_personas]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'walks',  filter: `walk_id=eq.${walkId}` }, payload => {
                    console.log('got a payload from subscribeJoinWalksPersonas', payload)
                    get(walkId)
                })
            .subscribe()
    }

    function unsubscribeJoinWalksPersonas(){
        client.removeChannel(realtimeChannelJoinWalksPersonas)
    }




    function subscribeJoinWalksActions(walkId){
        realtimeChannelJoinWalksActions = client
            .channel('public:[steps_actions]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'walks',  filter: `walk_id=eq.${walkId}` }, payload => {
                    console.log('got a payload from subscribeJoinWalksPersonas', payload)
                    get(walkId)
                })
            .subscribe()
    }

    function unsubscribeJoinWalksActions(){
        client.removeChannel(realtimeChannelJoinWalksActions)
    }




    async function add (walk, process) {
        const { error, data } = await client
            .from('walks')
            .insert({
                date: walk.date,
                video: walk.video,
                process: process,
                delete: false
            })
            .select('id')
            .single()
        if (error) return error
        // if personas, add personas
        if(walk.personas) {
            for await (const persona of walk.personas) {
                addPersonaJoin(data.id, persona)
            }
        }
        console.log('added walk', walk, process)
        return;
    }

    async function edit (walk, previousPersonas) {
        const { error, data } = await client
            .from('walks')
            .upsert({
                id: walk.id,
                date: walk.date,
                video: walk.video,
                process: walk.process
            })
            .select('id')
            .single()
        if (error) console.log(error)

        if(previousPersonas) {
            let newList = walk.personas
            let oldList = previousPersonas
            console.log('compare newList with Oldlist', newList, oldList)
            // Loop over newList, check if in oldList
            for (let i = 0; i < newList.length; i++) {
                if(oldList.includes(newList[i])) {
                    // if true: remove from oldList
                    oldList = oldList.filter(item => item !== newList[i])
                } else {
                    // if false: addPersonaJoin
                    addPersonaJoin(data.id, newList[i])
                }
            }
            // Remove remaining in oldList from JOIN table
            for (let i = 0; i < oldList.length ; i++) {
                removePersonaJoin(data.id, oldList[i])
            }

        } else {
            if(walk.personas) {
                for await (const persona of walk.personas) {
                    addPersonaJoin(data.id, persona)
                }
            }
        }

        return data
    }

    async function addPersonaJoin(walkId, personaId){
        console.log('adding persona join', {walkId}, {personaId})
        await client
            .from('walks_personas')
            .insert({
                walk_id: walkId,
                persona_id: personaId,
            })
            .select()
    }
    async function removePersonaJoin(walkId, personaId){
        console.log('removing persona join', {walkId}, {personaId})
        await client
            .from('walks_personas')
            .delete()
            .eq('persona_id', personaId)
            .eq("walk_id", walkId)
    }

    async function remove(id) {
        // Delete the JOIN first
        await client
            .from('walks_personas')
            .delete()
            .eq('walk_id', id)

        // Then delete the walk
        await client
            .from('walks')
            .delete()
            .eq('id', id)
    }

    function emptyList() {
        list.value = []
    }



    return { single, list, get, getWalksOfProcess, subscribeSingle, unsubscribeSingle, subscribeList, unsubscribeList, subscribeJoinWalksPersonas, unsubscribeJoinWalksPersonas, subscribeJoinWalksActions, unsubscribeJoinWalksActions, add, edit, remove, emptyList }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWalksStore, import.meta.hot));
}
