<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { TresCanvas, useTexture } from '@tresjs/core'
import { GlobalAudio, useGLTF } from '@tresjs/cientos'
import { useWindowSize } from '@vueuse/core'
import {
  PCFSoftShadowMap,
  SRGBColorSpace,
  ACESFilmicToneMapping,
} from 'three'
// Internals
import { useMainStore } from '@/stores'
import { useSettingStore } from "@/stores/settings";
import { perfectWidthResolution } from '@/constants'
import * as camMotion from './utils/CameraAnimation'
// COMPONENTS
import LoadingScreen from '../misc/LoadingScreen.vue'
import Floor from './components/theFloor.vue'
import Nail from './components/PureNail.vue'
import Chains from './components/TheChains.vue'
import TheEnvironment from './components/TheEnvironment.vue'
import TheMouse from './components/TheMouse.vue'


const settingStore = useSettingStore()
const store = useMainStore()
const route = useRoute()
const music = ref()
const bgMusic = "/assets/Kingdom's Edge.mp3"
const cameraRef = ref()
const parallaxFactor = ref(5)

const gl = {
  clearColor: '#111',
  shadows: true,
  alpha: false,
  shadowMapType: PCFSoftShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 1.5,
  antialias: true,
}

//modifiers
watch(cameraRef, camera => {
  camera.setFocalLength(45)
  camera.updateProjectionMatrix()
})

watch(music, (_music) => {
  store.musicInstance = _music.sound
})

watch(() => route.name, () => {
  if (route.name === 'AboutMe') {
    camMotion.aboutViewAnimation(cameraRef.value)
    parallaxFactor.value = 0.25
  } if (route.name === 'ContactMe') {
    camMotion.contactViewPosition(cameraRef.value)
  }
  if (route.name === 'home') {
    if (!cameraRef.value?.position) return
    camMotion.originalPosition(cameraRef.value)
    parallaxFactor.value = 5
  }
})

//responsive
const { width } = useWindowSize()
const scaleFactor = computed(() => Math.min(Math.max(width.value / perfectWidthResolution, 0.75), 1.10))

// Loads
const { map: startParticle } = await useTexture({ map: '/textures/startParticle.png' })

const floorMap = await useTexture({
  map: '/textures/floor/floor.jpg',
  normalMap: '/textures/floor/floor_nor.jpg',
  roughnessMap: '/textures/floor/floor_rough.jpg',
  displacementMap: '/textures/floor/floor_disp.jpg',
})

const { scene } = await useGLTF('/models/Pure_Nail.glb', { draco: true })

const { scene: iron } = await useGLTF('/models/iron_chain.glb')
</script>
<template>
  <LoadingScreen />
  <TresCanvas v-bind="gl" window-size class="canvas-styles">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 3.5, 25]" :fov="30" />
    <Suspense>
      <GlobalAudio ref="music" :src="bgMusic" :volume="settingStore.environmentVolume" :loop="true" />
    </Suspense>
    <Floor :textures="floorMap" />
    <Chains :model="iron" />
    <Nail :model="scene" :scaleFactor="scaleFactor" />
    <TheEnvironment :parallaxFactor="parallaxFactor" :startParticle="startParticle" />
    <TheMouse :route="route" :scaleFactor="scaleFactor" />
  </TresCanvas>
</template>
<style scoped>
.canvas-styles {
  z-index: 0;
}
</style>
