import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { Pane } from 'tweakpane'

export const useDebuggerStore = defineStore('debugger', () => {
  //debug
  // import { useDebuggerStore } from '@/stores/debugger'
  // const store = useDebuggerStore()
  const debug = reactive({
    x: 0,
    y: 0,
    z: 0
  })

  const pane = new Pane()

  pane.addBinding(debug, 'x', {
    min: -30,
    max: 30
  })
  pane.addBinding(debug, 'y', {
    min: -30,
    max: 30
  })
  pane.addBinding(debug, 'z', {
    min: -30,
    max: 30
  })

  return { debug }
})
