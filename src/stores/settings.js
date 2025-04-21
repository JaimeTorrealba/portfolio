import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => {
  const environmentVolume = ref(0.1)

  return { environmentVolume }
})
