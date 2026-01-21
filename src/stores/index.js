import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const finishLoading = ref(false)
    const isHovered = ref(false)
    const soundElement = shallowRef(null)

    return { finishLoading, isHovered, soundElement }
})