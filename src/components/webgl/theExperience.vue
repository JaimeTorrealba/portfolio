<script setup>
import { WebGPURenderer } from 'three/webgpu'
import { ref, watch, toValue } from "vue";
import { TresCanvas } from "@tresjs/core";
import { Stats } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
import TheEnvironment from "./components/TheEnvironment.vue";
import Lights from "./components/Lights.vue";
import Floor from './components/Floor.vue';
import Precipitation from './components/Precipitation.vue';
// import CameraMouse from "./components/CameraMouse.vue";

const cameraRef = ref();

const gl = {
  clearColor: "#111",
  shadows: true,
  alpha: false,
  shadowMapType: PCFSoftShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
  antialias: true,
};

const createWebGPURenderer = (ctx) => {
  const renderer = new WebGPURenderer({
    canvas: toValue(ctx.canvas),
  })
  return renderer
}

watch(cameraRef, (camera) => {
  camera.far = 500;
  camera.setFocalLength(45);
  camera.updateProjectionMatrix();
});
</script>
<template>
  <TresCanvas v-bind="gl" window-size :renderer="createWebGPURenderer">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 5, 25]" />
    <TresFog color="#111" :near="8" :far="95" />
    <Stats />
    <!-- <CameraMouse /> -->
    <Precipitation />
    <Floor />
    <Lights />
    <!-- <TheEnvironment /> -->
  </TresCanvas>
</template>
<style>
.tp-dfwv {
  z-index: 999999;
}
</style>
