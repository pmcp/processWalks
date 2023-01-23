import { useSupabase } from '~/composables/useSupabase.ts'

// Hot reload



let realTimeChannel
export const useMembersStore = defineStore('members-store', () => {
    const client = useSupabase()
    const list = ref([])

    async function getAll() {
        try {
            const { data, error } = await client
                .from('profiles')
                .select('id, email, admin, delete')
                .order('email', { ascending: false })
                .is('delete', false)
            if (error) console.log(error)
            if (data) {
                list.value = data
                return;
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    function subscribe(){
        realTimeChannel = client
            .channel('public:[profile]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' }, payload => {
                    getAll()
                })
            .subscribe()
    }

    function unsubscribe(){
        client.removeChannel(realTimeChannel)
    }

    async function makeAdmin(profileId, val){
        const { data, error } = await client
            .from('profiles')
            .update({ admin: val })
            .eq('id', profileId)
            .select()
        if (error) console.log(error)
        console.log(data)
    }

    async function remove (profileId) {
        const { data, error } = await client
            .from('profiles')
            .update({ delete: true, timeOfDeletion: new Date().toISOString() })
            .eq('id', profileId)
        if (error) throw error
        if (data) {
            console.log('done deleting', data)
        }
    }

    return { list, getAll, subscribe, unsubscribe, makeAdmin, remove }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
