export default defineNuxtConfig({
    modules: [
        '@vueuse/nuxt',
        '@nuxtjs/supabase',
        '@formkit/nuxt'
    ],
    css: ["@/assets/css/styles.css"],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
})