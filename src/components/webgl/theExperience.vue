<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { TresCanvas, useTexture } from '@tresjs/core'
import { useGLTF } from '@tresjs/cientos'
import { useWindowSize } from '@vueuse/core'
import {
  PCFSoftShadowMap,
  SRGBColorSpace,
  ACESFilmicToneMapping,
} from 'three'
import { NoisePmndrs, EffectComposerPmndrs } from '@tresjs/post-processing'
// Internals
import { useMainStore } from '@/stores'
// import { useSettingStore } from "@/stores/settings";
import { perfectWidthResolution } from '@/constants'
// COMPONENTS

import BookModel from './components/BookModel.vue'
import TheEnvironment from './components/TheEnvironment.vue'

// const { checkRoute } = useCustomRouterFn()
// const settingStore = useSettingStore()
const store = useMainStore()
const router = useRouter()
const musicRef = ref()
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

const onClickModel = () => {
  router.push('/main')
}

//modifiers
watch(cameraRef, camera => {
  camera.setFocalLength(45)
  camera.updateProjectionMatrix()
})

watch(musicRef, (_music) => {
  store.musicInstance = _music.instance
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
  <TresCanvas v-bind="gl" window-size>
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 3.5, 25]" :fov="30" />
    <BookModel @click-model="onClickModel" :model="scene" :scaleFactor="scaleFactor" />
    <TheEnvironment :startParticle="startParticle" :floor-textures="floorMap" :chainModel="ironChain" />
    <Suspense>
      <EffectComposerPmndrs>
        <NoisePmndrs
          premultiply
        />
      </EffectComposerPmndrs>
    </Suspense>
  </TresCanvas>
</template>
<style scoped>
</style>
