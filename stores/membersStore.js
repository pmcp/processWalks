import { useSupabase } from '~/composables/useSupabase.ts'

export const useMembersStore = defineStore('members-store', () => {
    let realTimeChannel
    const list = ref([])

    async function getAll() {
        try {
            const { data, error } = await useSupabase()
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
        realTimeChannel = useSupabase()
        .channel('public:[profile]')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' }, payload => {
                getAll()
            })
        .subscribe()
    }

    function unsubscribe(){
        useSupabase().removeChannel(realTimeChannel)
    }

    async function makeAdmin(profileId, val){
        try {
            const { data, error } = await useSupabase()
                .from('profiles')
                .update({ admin: val })
                .eq('id', profileId)
                .select()
            if (error) console.log(error)
        } catch (error) {
            console.log(error)
        } finally {}
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


// Hot reload
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
