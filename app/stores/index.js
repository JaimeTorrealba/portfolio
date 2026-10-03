import { ref, computed } from 'vue'
import { defineStore, skipHydrate } from 'pinia'
import { usePreferredReducedMotion } from '@vueuse/core'

export const useMainStore = defineStore('main', () => {
  const finishLoading = ref(false) // to false
  // The menu waits for the scene, but only up to a cap (theMenu.vue sets this when it is
  // hit). Past it, the menu shows on top of the loading screen while the scene finishes.
  const menuWaitExpired = ref(false)
  const menuReady = computed(() => finishLoading.value || menuWaitExpired.value)
  const gpuTier = ref(null)

  const preferredMotion = usePreferredReducedMotion()
  // null = follow the OS preference. The #debug pane writes a boolean here to
  // force either state without touching system settings.
  const motionOverride = ref(null)
  const reducedMotion = computed({
    get: () => motionOverride.value ?? (preferredMotion.value === 'reduce'),
    set: (value) => { motionOverride.value = value },
  })
  const followSystemMotion = () => { motionOverride.value = null }

  // null = use whatever detect-gpu reports. The #debug pane writes a tier here to see
  // how the scene builds itself for another class of GPU. Session-scoped, so closing
  // the tab drops back to the real device.
  // The page is prerendered, so this also runs on the server, where there is no
  // sessionStorage. skipHydrate stops the server's null from overwriting the value the
  // client just read back.
  const TIER_OVERRIDE_KEY = 'debug:gpuTierOverride'
  const storedOverride = import.meta.client ? sessionStorage.getItem(TIER_OVERRIDE_KEY) : null
  const tierOverride = skipHydrate(ref(storedOverride === null ? null : Number(storedOverride)))

  let _gpuTierPromise = null
  // `gpuTier` stays the raw detected result; only the value handed to callers carries
  // the override, so the pane can still show what Auto actually resolved to.
  // detect-gpu is only needed by the client-only scene, so it is loaded on first use
  // rather than shipped with the loading screen.
  const resolveGPUTier = () => {
    if (!_gpuTierPromise) {
      _gpuTierPromise = import('detect-gpu').then(({ getGPUTier }) =>
        // Self-hosted (nuxt.config.js nitro.publicAssets) rather than detect-gpu's unpkg default.
        getGPUTier({ benchmarksURL: '/detect-gpu-benchmarks' })
      ).then(result => {
        gpuTier.value = result
        return result
      })
    }
    return _gpuTierPromise.then(result =>
      tierOverride.value === null ? result : { ...result, tier: tierOverride.value }
    )
  }

  // Tier is read once per component at setup -- Grass and Smoke await it at the top level
  // of <script setup> and size geometry from it -- so there is no honest way to restyle a
  // live scene into another tier. Persisting the choice and reloading gives a real cold
  // boot, which is the point of the control, and sidesteps re-adding every pane folder to
  // the global Pane on remount. The #debug hash survives the reload.
  const setTierOverride = (value) => {
    if (value === null) sessionStorage.removeItem(TIER_OVERRIDE_KEY)
    else sessionStorage.setItem(TIER_OVERRIDE_KEY, String(value))
    window.location.reload()
  }

  return {
    finishLoading, menuWaitExpired, menuReady, gpuTier, reducedMotion, followSystemMotion, resolveGPUTier,
    tierOverride, setTierOverride,
  }
})