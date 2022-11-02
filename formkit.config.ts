import { generateClasses } from '@formkit/themes'
import { createProPlugin, repeater, rating } from '@formkit/pro'


import theme from './formkit.theme.js'


const pro = createProPlugin('fk-6e8362e2b8', {
    rating,
    repeater
})

export default {
    plugins: [pro],
    config: {
        classes: generateClasses(theme)
    }
}