import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const finishLoading = ref(false)
    const showFirstPage = ref(true)

    const HKWordsIndex = ref(0)
    
    return { finishLoading, showFirstPage, HKWordsIndex }
})