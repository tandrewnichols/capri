import { configure } from '@kadira/storybook'
import '../app/css/main.less'

const req = require.context('../app/stories', true, /\.js$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)
