import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const finishLoading = ref(true)
    const isHovered = ref(false)

    return { finishLoading, isHovered }
})