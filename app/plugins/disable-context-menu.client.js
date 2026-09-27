import { defineNuxtPlugin } from '#imports'

// Carried over from the old index.html: no right-click menu over the scene.
export default defineNuxtPlugin(() => {
  document.oncontextmenu = document.body.oncontextmenu = () => false
})
