<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { TresCanvas, useTexture } from "@tresjs/core";
import { useGLTF, useProgress } from "@tresjs/cientos";
// import { useWindowSize } from '@vueuse/core'
import { PCFSoftShadowMap, SRGBColorSpace, AgXToneMapping } from "three";
import { NoisePmndrs, EffectComposerPmndrs } from "@tresjs/post-processing";
// Internals
import { useMainStore } from "@/stores";
// import { useSettingStore } from "@/stores/settings";
// import { perfectWidthResolution } from '@/constants'
// COMPONENTS

import InteractiveScene from "./components/InteractiveScene.vue";
import TheEnvironment from "./components/TheEnvironment.vue";
import CameraMouse from "./components/CameraMouse.vue";


// const { checkRoute } = useCustomRouterFn()
// const settingStore = useSettingStore()
const store = useMainStore();
const router = useRouter();
const cameraRef = ref();

const gl = {
  clearColor: "#111",
  shadows: true,
  alpha: false,
  shadowMapType: PCFSoftShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: AgXToneMapping,
  toneMappingExposure: 1.5,
  antialias: true,
};

const onClickModel = () => {
  router.push("/main");
};

//modifiers
watch(cameraRef, (camera) => {
  camera.setFocalLength(45);
  camera.updateProjectionMatrix();
  console.log(camera.getFocalLength());
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

const { scene } = await useGLTF("/models/Necronomicon.glb", { draco: true });
const { hasFinishLoading } = await useProgress();
watch(hasFinishLoading, (value) => {
  if (value) {
    store.finishLoading = value;
  }
});
</script>
<template>
  <TresCanvas v-bind="gl" window-size>
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 5, 25]" />
    <CameraMouse />
    <InteractiveScene @click-model="onClickModel" :model="scene" />
    <TheEnvironment
      :startParticle="startParticle"
      :floor-textures="floorMap"
    />
    <!-- <Suspense>
      <EffectComposerPmndrs>
        <NoisePmndrs premultiply />
      </EffectComposerPmndrs>
    </Suspense> -->
  </TresCanvas>
</template>
<style scoped></style>
