import { generateClasses } from '@formkit/themes'
import theme from './formkit.theme.js'

export default {
    config: {
        classes: generateClasses(theme)
    }
}