import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/utils/motion.js'

// JS transition hooks for theMenu.vue: the cards (<Transition>) and the menu buttons
// (<TransitionGroup>, staggered through each button's data-index).

export const animateCardIn = (el, done) => {
  if (prefersReducedMotion()) {
    done()
    return
  }
  // The card's blurred glass sits over a canvas that redraws every frame. Promoting it
  // to its own layer for the scale-in lets the compositor move it instead of repainting
  // it each frame; dropped afterwards so an open card does not hold the layer.
  el.style.willChange = 'transform'
  gsap.fromTo(
    el,
    { scale: 0.88, y: 48 },
    {
      scale: 1,
      y: 0,
      duration: 0.65,
      ease: 'power3.out',
      // Hand positioning back to the stylesheet. GSAP's inline transform would pin the
      // card to the breakpoint it opened in, and it would sit wrong after a resize or zoom.
      clearProps: 'transform',
      onComplete: () => {
        el.style.willChange = ''
        done()
      },
    }
  )
}

export const animateCardOut = (el, done) => {
  if (prefersReducedMotion()) {
    done()
    return
  }
  // Same layer promotion as animateCardIn; the element is removed when this finishes.
  el.style.willChange = 'transform'
  gsap.to(el, {
    opacity: 0,
    scale: 0.92,
    y: 32,
    duration: 0.15,
    ease: 'power2.in',
    onComplete: done,
  })
}

export const animateMenuButtonIn = (el, done) => {
  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, scale: 1, y: 0 })
    done()
    return
  }
  const index = parseInt(el.dataset.index || '0')
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.7, y: 24 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      delay: index * 0.12,
      ease: 'power3.out',
      onComplete: done,
    }
  )
}

export const animateMenuButtonOut = (el, done) => {
  if (prefersReducedMotion()) {
    done()
    return
  }
  const index = parseInt(el.dataset.index || '0')
  gsap.to(el, {
    opacity: 0,
    scale: 0.85,
    y: 16,
    duration: 0.2,
    delay: index * 0.06,
    ease: 'power2.in',
    onComplete: done,
  })
}
