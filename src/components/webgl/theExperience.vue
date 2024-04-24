<script setup>
import { ref, watch, computed } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { MouseParallax } from '@tresjs/cientos'
import { useWindowSize } from '@vueuse/core'
import { perfectWidthResolution } from '@/constants'
// COMPONENTS
import LoadingScreen from '../misc/LoadingScreen.vue'
import Floor from './theFloor.vue'
import Nail from './PureNail.vue'
import SpotLight from './SpotLight.vue'
import ParticlesRing from './ParticlesRing.vue'

//TODO add shadow

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

</script>
<template>
  <LoadingScreen />
  <TresCanvas clear-color="#111" window-size shadows class="canvas-styles">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 3.5, 25]" :fov="30" />
    <TresFog color="#111" near="8" far="50" />
    <Suspense>
      <Floor :scaleFactor="scaleFactor" />
    </Suspense>
    <Suspense>
      <Nail :scaleFactor="scaleFactor" />
    </Suspense>
    <SpotLight />
    <MouseParallax :ease="1" :factor="1" />
    <TresAmbientLight color="#F5EBD4" :intensity="0.025" />
    <ParticlesRing :scaleFactor="scaleFactor" />
  </TresCanvas>
</template>
<style scoped>
.canvas-styles {
  z-index: -10;
}

.music-trigger {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  padding: 10px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 0 0 0 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
