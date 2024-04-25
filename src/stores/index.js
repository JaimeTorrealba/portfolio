import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const finishLoading = ref(false)
    const showFirstPage = ref(true)
    
    return { finishLoading, showFirstPage }
})