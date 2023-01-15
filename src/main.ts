import { createApp } from 'vue'
import App from './App.vue'

import './renderer.d.ts'
import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretUp, faCircleStop, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCaretUp, faCircleStop, faPlay, faXmark )

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
