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
import { useCustomRouterFn } from "@/composables/routers.js";
import * as camMotion from './utils/CameraAnimation'
// COMPONENTS
import LoadingScreen from '../common/LoadingScreen.vue'
import Floor from './components/theFloor.vue'
import Model from './components/TheModel.vue'
import Chains from './components/TheChains.vue'
import TheEnvironment from './components/TheEnvironment.vue'

const { checkRoute } = useCustomRouterFn()
const settingStore = useSettingStore()
const store = useMainStore()
const route = useRoute()
const musicRef = ref()
const bgMusic = "/assets/Kingdom's Edge.mp3"
const cameraRef = ref()

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

watch(musicRef, (_music) => {
  store.musicInstance = _music.instance
})

watch(() => route.name, () => {
  if (checkRoute('ContactMe')) {
    camMotion.contactPos(cameraRef.value)
  }
  if (checkRoute('OSS')) {
    camMotion.OSSPos(cameraRef.value)
  }
  if (checkRoute('LatestExperiences')) {
    camMotion.latestExperiencePos(cameraRef.value)
  }
  if (checkRoute('Main') || checkRoute('Home') || checkRoute('Articles')) {
    if (!cameraRef.value?.position) return
    camMotion.initPos(cameraRef.value)
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

const { scene } = await useGLTF('/models/Necronomicon.glb', { draco: true })

const { scene: ironChain } = await useGLTF('/models/iron_chain.glb')
</script>
<template>
  <LoadingScreen />
  <TresCanvas v-bind="gl" window-size class="canvas-styles">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 3.5, 25]" :fov="30" />
    <Suspense>
      <GlobalAudio ref="musicRef" :src="bgMusic" :volume="settingStore.environmentVolume" :loop="true" />
    </Suspense>
    <Floor :textures="floorMap" />
    <Chains :model="ironChain" />
    <Model :model="scene" :scaleFactor="scaleFactor" />
    <TheEnvironment :startParticle="startParticle" />
  </TresCanvas>
</template>
<style scoped>
.canvas-styles {
  z-index: -10;
}
</style>
