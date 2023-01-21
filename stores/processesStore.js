import { useSupabase } from '~/composables/useSupabase.ts'
import {useWalksStore} from "~/stores/walksStore";

let realTimeChannel
let realTimeChannelSingle
export const useProcessesStore = defineStore('processes-store', () => {
    const client = useSupabase()

    let list = ref([])

    // async function get(processId) {
    //     try {
    //         let { data, error, status } = await client
    //             .from('processes')
    //             .select('id, name, passwordProtected, description, walks(id), profiles!profi_proc(email), delete')
    //             .eq('id', processId)
    //             .single()
    //         if (error && status !== 406) throw error
    //         if (data) {
    //             list.value = data
    //             return;
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         error.value = error.message
    //     } finally {
    //
    //     }
    // }

    async function getAll () {
        try {
            let { data, error, status } = await client
                .from('processes')
                .select('id, name, passwordProtected, description, walks(id), profiles!profi_proc(email), delete')
                .order('created_at', { ascending: false })
                .is('delete', false)
            if (error && status !== 406) throw error
            if (data) {
                list.value = data
                return;
            }
        } catch (error) {
            console.log(error)
            error.value = error.message
        } finally {

        }
    }

    function subscribe(){
        realTimeChannel = client
        .channel('public:[process]')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'processes' }, payload => {
                getAll()
            })
        .subscribe()
    }

    function unsubscribe(){
        client.removeChannel(realTimeChannel)
    }

    function subscribeSingle(processId, walkId){
        realTimeChannelSingle = client
            .channel('public:[processes]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'processes', filter: `id=eq.${processId}` }, payload => {
                    console.log('got a payload from subscribeSingle', processId)
                    const walks = useWalksStore()
                    walks.get(walkId)
                })
            .subscribe()
    }

    function unsubscribeSingle(){
        client.removeChannel(realTimeChannelSingle)
    }


    let activeProcessId = ref(null)
    const activeProcess = computed(() => list.value.find(item => item.id === activeProcessId.value));

    return { list, getAll, activeProcess, activeProcessId, subscribe, unsubscribe, subscribeSingle, unsubscribeSingle }

})