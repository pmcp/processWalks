import { useSupabase } from '~/composables/useSupabase.ts'

export const useProcessesStore = defineStore('processes-store', () => {
    let realTimeChannel
    let list = ref([])
    async function getAll () {
        try {
            let { data, error, status } = await useSupabase()
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
        realTimeChannel = useSupabase()
        .channel('public:[process]')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'processes' }, payload => {
                getAll()
            })
        .subscribe()
    }

    function unsubscribe(){
        useSupabase().removeChannel(realTimeChannel)
    }


    let activeProcessId = ref(null)
    const activeProcess = computed(() => list.value.find(item => item.id === activeProcessId.value));

    return { list, getAll, activeProcess, activeProcessId, subscribe, unsubscribe }

})