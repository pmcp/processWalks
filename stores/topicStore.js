import { useSupabase } from '~/composables/useSupabase.ts'

// Hot reload


let realTimeChannel
export const useTopicsStore = defineStore('topics-store', () => {
    const client = useSupabase()
    const list = ref([])

    const listFormkitFormatted = computed(() => {
        return list.value.map((p) => {

            return {
                value: p.id,
                label: p.name,
            }
        })
    })

    async function getAll() {
        try {
            const { data, error } = await client
                .from('topics')
                .select('id, name, description')
                .order('description', { ascending: false })
            // .is('delete', false)
            if (error) console.log(error)
            if (data) {
                list.value = data
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }


    function subscribe(){
        realTimeChannel = client
            .channel('public:[topics]')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'topics' }, payload => {
                    console.log('change')
                    getAll()
                })
            .subscribe()
    }

    function unsubscribe(){
        client.removeChannel(realTimeChannel)
    }

    async function add (item) {
        const { error, data } = await client.from('topics')
            .insert({
                name: item.name,
                description: item.description,
            })
            .select()
        if (error) {
            console.log(error)
        }
        return data
    }

    async function remove(topicId) {
        // Delete the JOIN first
        await client
            .from('steps_topics')
            .delete()
            .eq('topic_id', topicId)

        // Then delete the persona
        await client
            .from('topic')
            .delete()
            .eq('id', topicId)
    }


    return { list, listFormkitFormatted, add, getAll, subscribe, unsubscribe, remove }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePersonasStore, import.meta.hot));
}
