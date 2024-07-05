import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import hoverMenuPath from '/assets/JDSherbert - Ultimate UI SFX Pack - Swipe - 1.mp3'

export const useSettingStore = defineStore('setting', () => {
  const hoverMenuVolume = ref(0.1)
  const environmentVolume = ref(0.1)

  const { play: hoverMenuPlay } = useSound(hoverMenuPath, { volume: hoverMenuVolume })
  const hoverElement = () => {
    hoverMenuPlay()
  }

  return { hoverElement, environmentVolume, hoverMenuVolume }
})
