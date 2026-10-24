// Moving specular highlight: a CSS radial gradient clipped to part of the art (the card's
// frame band, a button's face), following the pointer through --lx / --ly. Pure CSS on
// its own element: it never touches the SVG, so moving it never re-runs a filter.
// Off under prefers-reduced-motion.
import { serializeCommands } from './rectWalker.js'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches

// clip-path: path() is resolved against the overlay's own box, which starts at -overflow.
// Several command lists are joined into one even-odd path (outer + inner = a band).
export const buildShineClipPath = (commandLists, overflow) =>
  `path(evenodd, "${commandLists.map((commands) => serializeCommands(commands, overflow, overflow)).join('')}")`

export const supportsShine = () => CSS.supports('clip-path', 'path("M0 0Z")') && !prefersReducedMotion()

export const createShine = (hostElement, className) => {
  const shineElement = document.createElement('span')
  shineElement.className = className
  shineElement.setAttribute('aria-hidden', 'true')
  let frameRequest = 0
  let pointer = null

  // One style write per frame at most, however fast pointermove fires.
  const applyPointer = () => {
    frameRequest = 0
    const box = hostElement.getBoundingClientRect()
    hostElement.style.setProperty('--lx', ((pointer.clientX - box.left) / box.width).toFixed(3))
    hostElement.style.setProperty('--ly', ((pointer.clientY - box.top) / box.height).toFixed(3))
  }
  const onPointerMove = (event) => {
    pointer = event
    if (!frameRequest) frameRequest = requestAnimationFrame(applyPointer)
  }
  hostElement.addEventListener('pointermove', onPointerMove, { passive: true })

  return {
    element: shineElement,
    setClipPath: (clipPath) => {
      shineElement.style.clipPath = clipPath
    },
    destroy: ({ keepDom = false } = {}) => {
      cancelAnimationFrame(frameRequest)
      hostElement.removeEventListener('pointermove', onPointerMove)
      if (keepDom) return
      shineElement.remove()
      hostElement.style.removeProperty('--lx')
      hostElement.style.removeProperty('--ly')
    },
  }
}
