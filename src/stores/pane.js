import { defineStore } from 'pinia'
import { Pane } from 'tweakpane'

export const usePaneStore = defineStore('pane', () => {
  //debug
  // import { usePaneStore } from '@/stores/pane'
  // const store = usePaneStore()
  const pane = window.location.href.includes('#debug') ? new Pane() : null

  return { pane }
})
