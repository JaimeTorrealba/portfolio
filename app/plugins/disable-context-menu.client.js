import { defineNuxtPlugin } from '#imports'

// Carried over from the old index.html: no right-click menu over the scene. Only the
// canvas, so links and text in the cards keep "open in new tab", copy, translate, etc.
export default defineNuxtPlugin(() => {
  document.addEventListener('contextmenu', (event) => {
    if (event.target instanceof HTMLCanvasElement) event.preventDefault()
  })
})
