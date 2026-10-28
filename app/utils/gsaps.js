import gsap from 'gsap'
import { prefersReducedMotion } from '@/utils/motion.js'

export const showText = (elem) => {
  const tl = gsap.timeline()

  if (prefersReducedMotion()) {
    return tl.set(elem, { yPercent: 0 })
  }

  return tl.from(elem, {
    yPercent: 200,
    ease: 'Power3.out',
    stagger: 0.01,
    duration: 0.75,
    delay: 0,
  })
}

export const fadeInText = (elem) => {
  const tl = gsap.timeline()

  if (prefersReducedMotion()) {
    return tl.set(elem, { opacity: 1 })
  }

  return tl.from(elem, {
    opacity: 0,
    ease: 'power2.out',
    duration: 0.6,
    // Starts partway through the card's 0.65s scale-in, so the fade reads.
    delay: 0.2,
  })
}

export const appear = (elem) => {
  const tl = gsap.timeline()

  if (prefersReducedMotion()) {
    return tl.set(elem, { opacity: 1 })
  }

  return tl.to(elem, {
    opacity: 1,
    duration: 1,
  })
}
