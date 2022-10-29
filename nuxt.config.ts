import { defineNuxtConfig } from 'nuxt'
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/supabase',
        '@vueuse/nuxt',
    ],
    css: ["@/assets/css/styles.css"],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
})