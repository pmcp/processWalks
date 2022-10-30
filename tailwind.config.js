const formKitTailwind = require('@formkit/themes/tailwindcss');

module.exports = {
  mode: "jit",
  purge: [
    "./assets/css/*.{css}",
    "./components/*.{vue,js}",
    "./components/**/*.{vue,js}",
    "./pages/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./*.{vue,js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  content: ['./src/**/*.{html,js}', './formkit.config.js'],
  plugins: [
    formKitTailwind
  ],
};
