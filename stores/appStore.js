export const useAppStore = defineStore('app-store', () => {
    const nav = ref([
        { name: 'Home', href: '/', admin: false },
        { name: 'Processes', href: '/processes', admin: false },
        { name: 'Members', href: '/members', admin: true }
    ])


    return { nav }
})
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
