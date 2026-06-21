import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getGPUTier } from 'detect-gpu'

export const useMainStore = defineStore('main', () => {
  const finishLoading = ref(false)
  const gpuTier = ref(null)

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

  return { finishLoading, gpuTier, resolveGPUTier }
})