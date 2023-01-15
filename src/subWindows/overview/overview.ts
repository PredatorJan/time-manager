import { createApp } from 'vue'
import Overview from './Overview.vue'

import '../../renderer.d.ts'
import '../../style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown, faCaretRight, faDownload, faFloppyDisk, faMinus, faPen, faPlus, faRotateRight, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faCaretDown, faCaretRight, faDownload, faFloppyDisk, faMinus, faPen, faPlus, faRotateRight, faTrashCan, faXmark )

createApp(Overview)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
