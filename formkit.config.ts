import { generateClasses } from '@formkit/themes'
import { createProPlugin, autocomplete, rating } from '@formkit/pro'

import theme from './formkit.theme.js'



const pro = createProPlugin('fk-6e8362e2b8', {
    autocomplete,
    rating
})

export default {
    plugins: [pro],
    config: {
        classes: generateClasses(theme)
    }
}