export default defineNuxtConfig({
    ssr: false,
    dir: {
        public: "public",
    },
    runtimeConfig: {
        public: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_KEY: process.env.SUPABASE_KEY,
        },
    },
    modules: [
        '@vueuse/nuxt',
        '@formkit/nuxt',
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore', 'acceptHMRUpdate'],
            },
        ],

    ],
    css: ["@/assets/css/styles.css"],
    formkit: {
        configFile: './formkit.config.ts',
    },
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
    imports: {
        dirs: ['stores'],
    },
})