// composables/useSupabase.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export const useSupabase = (): SupabaseClient => {
    const app = useNuxtApp();

    const supabase = app.$supabase;
    if (!app.$supabase) {
        console.log('supabase', supabase);
        throw new Error("Supabase Not Initialized Properly");
    }
    return supabase as SupabaseClient;
};
