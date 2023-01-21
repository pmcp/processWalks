import { useSupabase } from '~/composables/useSupabase.ts'
import { useWalksStore } from './walksStore'

let realtimeChannelSteps
export const useActionsStore = defineStore('actions-store', () => {
    const client = useSupabase()

    function subscribeList(walkId){
        realtimeChannelSteps = client
            .channel('tesst')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'actions', filter: `walk=eq.${walkId}` },payload => {
                    console.log('got a payload from subscribeList', payload)
                    const walks = useWalksStore()
                    walks.get(walkId)
                    console.log('GOTTA GET WALK')

                })
            .subscribe()
    }

    function unsubscribeList(){
        client.removeChannel(realtimeChannelSteps, subscribeList, unsubscribeList)
    }

    return { subscribeList, unsubscribeList }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useActionsStore, import.meta.hot));
}
