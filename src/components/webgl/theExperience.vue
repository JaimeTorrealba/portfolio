<script setup>
import { ref, watch } from "vue";
import { TresCanvas, useTexture } from "@tresjs/core";
// import { useWindowSize } from '@vueuse/core'
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
// Internals
// import { useSettingStore } from "@/stores/settings";
// import { perfectWidthResolution } from '@/constants'
// COMPONENTS

import Lights from "./components/Lights.vue";
import TheEnvironment from "./components/TheEnvironment.vue";
import CameraMouse from "./components/CameraMouse.vue";

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

//modifiers
watch(cameraRef, (camera) => {
  camera.far = 500;
  camera.setFocalLength(45);
  camera.updateProjectionMatrix();
});

//responsive
// const { width } = useWindowSize()
// const scaleFactor = computed(() => Math.min(Math.max(width.value / perfectWidthResolution, 0.75), 1.10))

// Loads
const { map: startParticle } = await useTexture({ map: "/textures/startParticle.png" });

const floorMap = await useTexture({
  map: "/textures/floor/floor.jpg",
  normalMap: "/textures/floor/floor_nor.jpg",
  roughnessMap: "/textures/floor/floor_rough.jpg",
  aoMap: "/textures/floor/floor_ao.jpg",
});
</script>
<template>
  <TresCanvas v-bind="gl" window-size>
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 5, 25]" />
    <CameraMouse />
    <Lights />
    <TheEnvironment :startParticle="startParticle" :floor-textures="floorMap" />
  </TresCanvas>
</template>
