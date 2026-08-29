import { useMainStore } from '@/stores'

/**
 * Reduced-motion check for GSAP code paths that run outside of a component
 * setup (module scope, transition hooks, three.js material tweens).
 *
 * Reads the store so the #debug pane toggle applies here too, and falls back to
 * the raw media query if it is ever called before Pinia is active.
 */
export const prefersReducedMotion = () => {
  try {
    return useMainStore().reducedMotion
  } catch {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }
}
