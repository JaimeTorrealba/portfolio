import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getGPUTier } from 'detect-gpu'
import { usePreferredReducedMotion } from '@vueuse/core'

export const useMainStore = defineStore('main', () => {
  const finishLoading = ref(false) // to false
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

  let _gpuTierPromise = null
  const resolveGPUTier = () => {
    if (!_gpuTierPromise) {
      _gpuTierPromise = getGPUTier().then(result => {
        gpuTier.value = result
        return result
      })
    }
    return _gpuTierPromise
  }

  return { finishLoading, gpuTier, reducedMotion, followSystemMotion, resolveGPUTier }
})