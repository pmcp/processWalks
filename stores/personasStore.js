import { useSupabase } from '~/composables/useSupabase.ts'

// Hot reload


let realTimeChannel
export const usePersonasStore = defineStore('personas-store', () => {
    const client = useSupabase()
    const list = ref([])


    async function getAll() {
        try {
            const { data, error } = await client
                .from('personas')
                .select('id, description')
                .order('description', { ascending: false })
                // .is('delete', false)
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

    const listFormkitFormatted = computed(() => {
        return list.value.map((p) => {
            return {
                value: p.id,
                label: p.description,
            }
        })
    })

    function subscribe(){
        realTimeChannel = client
            .channel('public:[personas]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'personas' }, payload => {
                    getAll()
                })
            .subscribe()
    }

    function unsubscribe(){
        client.removeChannel(realTimeChannel)
    }

    async function add (item) {
        const { error, data } = await client.from('personas')
            .insert({
                description: item.description,
            })
            .select()
        if (error) {
            console.log(error)
        }
        return data
    }

    async function remove(id) {
        // Delete the JOIN first
        await client
            .from('walks_personas')
            .delete()
            .eq('persona_id', id)

        // Then delete the persona
        await client
            .from('personas')
            .delete()
            .eq('id', id)
    }


    return { list, listFormkitFormatted, add, getAll, subscribe, unsubscribe, remove }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePersonasStore, import.meta.hot));
}
