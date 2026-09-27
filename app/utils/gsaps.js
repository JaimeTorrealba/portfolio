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
