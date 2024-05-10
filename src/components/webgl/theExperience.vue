<script setup>
import { ref, watch, computed } from 'vue'
import { TresCanvas, useTexture } from '@tresjs/core'
import { GlobalAudio } from '@tresjs/cientos'
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
import Floor from './theFloor.vue'
import Nail from './PureNail.vue'
import Chains from './TheChains.vue'
import SpotLight from './SpotLight.vue'
import ParticlesRing from './ParticlesRing.vue'
import MouseParallaxCustom from './MouseParallax.vue'

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

const { map: startParticle } = await useTexture({ map: '/textures/startParticle.png' })

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
    <Suspense>
      <Floor :scaleFactor="scaleFactor" />
    </Suspense>
    <Suspense>
      <Chains />
    </Suspense>
    <Suspense>
      <Nail :scaleFactor="scaleFactor" />
    </Suspense>
    <SpotLight />
    <TresAmbientLight color="#F5EBD4" :intensity="0.025" />
    <ParticlesRing :scaleFactor="scaleFactor" :alphaMap="startParticle" />
  </TresCanvas>
</template>
<style scoped>
.canvas-styles {
  z-index: -10;
}
</style>
