export const useAppStore = defineStore('app-store', () => {
    const nav = ref([
        { name: 'Home', href: '/', admin: false },
        { name: 'Actions', href: '/actions', admin: false },
        { name: 'Processes', href: '/processes', admin: false },
        { name: 'Members', href: '/members', admin: true }
    ])

    const walkLayout = ref('simple')

    function setWalkLayout(ui){
        console.log('setWalkLayout', ui)
        walkLayout.value = ui
        console.log(walkLayout.value)
    }

    return { nav, walkLayout, setWalkLayout }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
