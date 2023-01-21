import { useSupabase } from '~/composables/useSupabase.ts'
export const useVideoStore = defineStore('video-store', () => {
    const client = useSupabase()
    const currentTime = ref(0)
    const updateTime = (time) => currentTime.value = time
    async function add(upload, walkId) {
        const { data, error } = await client
            .from('walks')
            .update({ video: upload })
            .eq('id', walkId)
        if(error) console.log(error)
        console.log(data)
        // getWalk(route.params.walk)
    }

    return { currentTime, add, updateTime }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVideoStore, import.meta.hot));
}
