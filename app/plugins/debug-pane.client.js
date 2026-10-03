import { defineNuxtPlugin } from '#imports'
import { usePaneStore } from '@/stores/pane'

// Tweakpane is a debug tool, so it is a dynamic import behind the #debug hash: without
// it the chunk is never requested. Nuxt awaits plugins before mounting the app, so the
// Pane exists by the time the scene components add their folders in onMounted.
export default defineNuxtPlugin(async (nuxtApp) => {
  if (!window.location.href.includes('#debug')) return
  const { Pane } = await import('tweakpane')
  usePaneStore(nuxtApp.$pinia).pane = new Pane()
})
