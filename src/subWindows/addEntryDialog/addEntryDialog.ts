import { createApp } from 'vue'
import AddEntryDialog from './AddEntryDialog.vue'

import '../../renderer.d.ts'
import '../../style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add( faXmark )

createApp(AddEntryDialog)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
