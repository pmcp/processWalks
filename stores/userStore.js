

export const useUserStore = defineStore('user-store', () => {
    const id = ref(null)
    const admin = ref(false)
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
