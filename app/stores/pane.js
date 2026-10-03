import { shallowRef } from 'vue'
import { defineStore, skipHydrate } from 'pinia'

export const usePaneStore = defineStore('pane', () => {
  //debug
  // import { usePaneStore } from '@/stores/pane'
  // const store = usePaneStore()
  // Filled by plugins/debug-pane.client.js, and only on #debug, so tweakpane is never
  // downloaded by regular visitors. It is set before the app mounts, so components can
  // keep reading `usePaneStore().pane` synchronously in onMounted.
  // skipHydrate: not real state, and the prerendered null must not overwrite the Pane.
  const pane = skipHydrate(shallowRef(null))

  return { pane }
})
