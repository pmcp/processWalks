import { useSupabase } from '~/composables/useSupabase.ts'
export const useUserStore = defineStore('user-store', () => {
    const session = ref(null)
    const id = ref(null)
    const email = ref(null)
    const admin = ref(false)
    const message = ref(null)
    const { addAdminNav } = useAppStore();

    async function getUser () {
        try {
            const _session = await getSession()
            if(!_session) {
                session.value = null
                return
            }
            session.value = _session
            const user = await getProfile()
            admin.value = user.admin
            id.value = user.id
            email.value = user.email
        } catch(error) {
            console.error(error)
        }
    }

    // Check if there is an active session
    async function getSession () {
        return useSupabase().auth.getSession().then(({data}) => {
            if (data.session != null) {
                console.log('function', data.session)
                return data.session
            } else {
                return(false)
            }
        })
    }

    // Sign in
    async function signIn (data) {
        try {
            const { error } = await useSupabase().auth.signInWithOtp({ email: data.email })
            if (error) throw error
            message.value = `Please check your email, we've send you a login link.`

        } catch (error) {
            alert(error.error_description || error.message)

        } finally {
        }
    }

    // Get the profile of logged in user
    async function getProfile(){
        try {
            const {data, error} = await useSupabase()
                .from('profiles')
                .select('id, admin, email')
                .eq('id', session.value.user.id)
                .limit(1)
                .single()
            if (error) throw error
            if (data) {
                return data
            }
        } catch (error) {
            console.log(error)
        } finally {

        }
    }

    // Sign out user
    async function signOut () {
        const { error } = await useSupabase().auth.signOut()
        if (error) throw error
    }

    // Watch session
    async function watchSession () {
        return useSupabase().auth.onAuthStateChange((_, _session) => {
            if(_session === null) {
                session.value = null
                id.value = null
                email.value = null
                admin.value = false
                message.value = 'You are logged out'
            }
            if(_session) {
                getUser()
            }
        })
    }

    return { id, admin, email, message, getUser, getSession, signIn, getProfile, signOut, watchSession }


})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
