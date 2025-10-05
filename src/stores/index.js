import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const finishLoading = ref(false)
    const isHovered = ref(false)

    return { finishLoading, isHovered }
})