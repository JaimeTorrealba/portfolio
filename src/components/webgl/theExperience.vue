<script setup>
import { ref, watch, computed } from 'vue'
import { TresCanvas, useTexture } from '@tresjs/core'
import { GlobalAudio, useGLTF } from '@tresjs/cientos'
import { useWindowSize } from '@vueuse/core'
import { useMainStore } from '@/stores'
import { perfectWidthResolution } from '@/constants'
import {
  BasicShadowMap,
  SRGBColorSpace,
  NoToneMapping,
} from 'three'
// COMPONENTS
import LoadingScreen from '../misc/LoadingScreen.vue'
import Floor from './components/theFloor.vue'
import Nail from './components/PureNail.vue'
import Chains from './components/TheChains.vue'
import TheLights from './components/TheLights.vue'
import ParticlesRing from './components/ParticlesRing.vue'
import MouseParallaxCustom from './components/MouseParallax.vue'
import TheFire from './fire/TheFire.vue'

const store = useMainStore()

const music = ref()

watch(music, (_music) => {
  store.musicInstance = _music.sound
})

const gl = {
  clearColor: '#111',
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}
// Components
//debug
// import { useDebuggerStore } from '@/stores/debugger'
// const store = useDebuggerStore()

//modifiers
const cameraRef = ref()
watch(cameraRef, camera => {
  camera.lookAt(0, 3.5, 0)
  camera.setFocalLength(45)
  camera.updateProjectionMatrix()
})

//responsive
const { width } = useWindowSize()
const scaleFactor = computed(() => Math.min(Math.max(width.value / perfectWidthResolution, 0.75), 1.10))


// Loads

const { map: startParticle } = await useTexture({ map: '/textures/startParticle.png' })

const { map: fireTex } = await useTexture({
    map: '/textures/Fire.png'
})

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
    <TresFog color="#111" near="8" far="50" />
    <MouseParallaxCustom :ease="1" :factor="1" />
    <Suspense>
      <GlobalAudio ref="music" src="/assets/What_Dwells_Beneath.wav" :volume="0.5" :loop="true" />
    </Suspense>
      <Floor :textures="floorMap" />
      <Chains :model="iron" />
      <Nail :model="scene" :scaleFactor="scaleFactor" />
      <TheFire :texture="fireTex" />
    <ParticlesRing :scaleFactor="scaleFactor" :alphaMap="startParticle" />
    <TheLights />
  </TresCanvas>
</template>
<style scoped>
.canvas-styles {
  z-index: -10;
}
</style>
