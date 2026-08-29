<script setup>
import { WebGPURenderer } from 'three/webgpu'
import { ref, watch, toValue, onMounted } from "vue";
import { TresCanvas } from "@tresjs/core";
import { Stats } from "@tresjs/cientos";
import { useMainStore } from "@/stores";
import { usePaneStore } from "@/stores/pane";
import { SRGBColorSpace, ACESFilmicToneMapping } from "three";
import Lights from "./components/Lights.vue";
import Floor from './components/Floor.vue';
import Trees from './components/Trees.vue';
import Smoke from './components/Smoke.vue';
import Grass from './components/Grass.vue';
import Precipitation from './components/Precipitation.vue';
import CameraMouse from "./components/CameraMouse.vue";
import PostProcessing from "./components/PostProcessing.vue";
import Moon from "./components/Moon.vue";
import Clouds from "./components/Clouds.vue";

// TODO: addons like SPACE for running
// TODO: Add variation to the floor
// TODO: Clipping on the clouds to the grass

const store = useMainStore();
const cameraRef = ref();

const gl = {
  clearColor: "#111",
  shadows: false,
  alpha: false,
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

const showDebug = ref(false);
onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  showDebug.value = true;

  const pane = usePaneStore().pane;
  const folder = pane.addFolder({ title: "Motion", expanded: false });
  const motionOptions = { reducedMotion: store.reducedMotion };
  const binding = folder
    .addBinding(motionOptions, "reducedMotion", { label: "reduce motion" })
    .on("change", ({ value }) => {
      store.reducedMotion = value;
    });
  folder
    .addButton({ title: "follow system" })
    .on("click", () => store.followSystemMotion());

  // Keep the checkbox truthful when the value changes from anywhere else
  // (the "follow system" button, or the OS preference itself).
  watch(
    () => store.reducedMotion,
    (value) => {
      motionOptions.reducedMotion = value;
      binding.refresh();
    }
  );
})
</script>
<template>
  <TresCanvas
    v-bind="gl"
    window-size
    :renderer="createWebGPURenderer"
    :render-mode="store.reducedMotion ? 'on-demand' : 'always'"
  >
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 5, 25]" />
    <TresFog color="#111" :near="8" :far="95" />
    <Stats v-if="showDebug" />
    <CameraMouse />
    <Trees />
    <Suspense>
      <Smoke />
    </Suspense>
    <Precipitation />
    <Suspense>
      <Grass />
    </Suspense>
    <Suspense>
      <Floor />
    </Suspense>
    <Moon />
    <Clouds />
    <Lights />
    <PostProcessing />
  </TresCanvas>
</template>
<style>
.tp-dfwv {
  z-index: 9999;
}
</style>
