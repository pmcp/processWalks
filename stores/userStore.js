export const useUserStore = defineStore({
    id: 'user-stores',
    state: () => {
        return {
            id: null,
            admin: false
        }
    },
    actions: {},
    getters: {}
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
