<script setup>
import { WebGPURenderer } from 'three/webgpu'
import { ref, watch, toValue, onMounted, onUnmounted } from "vue";
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
import Atmosphere from "./components/Atmosphere.vue";

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

// The loading screen used to hang off the smoke's noise worker, which meant it broke
// the moment the smoke changed. It now waits on the three async scene children
// instead, so it stays correct even if one of them is tier-gated off.
let pendingScenes = 3;
let loaderFallback = null;

const onSceneChildResolve = () => {
  if (--pendingScenes > 0) return;
  // Let a frame actually paint before tearing the loader down, otherwise the reveal
  // lands on an empty canvas.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      store.finishLoading = true;
    })
  );
};

watch(
  () => store.finishLoading,
  (done) => {
    if (done) clearTimeout(loaderFallback);
  }
);

onUnmounted(() => clearTimeout(loaderFallback));

const showDebug = ref(false);
onMounted(() => {
  // Never trap a visitor behind the loader if a child never resolves.
  loaderFallback = setTimeout(() => {
    store.finishLoading = true;
  }, 10000);

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

  // Its own folder rather than a binding inside Motion, since forcing a GPU tier is not a
  // motion setting -- but it sits directly under it in the pane.
  const perfFolder = pane.addFolder({ title: "Performance", expanded: false });
  const tierOptions = { tier: store.tierOverride ?? -1 }; // -1 = Auto
  perfFolder
    .addBinding(tierOptions, "tier", {
      label: "GPU tier",
      options: { Auto: -1, "Tier 0": 0, "Tier 1": 1, "Tier 2": 2, "Tier 3": 3, "Tier 4": 4 },
    })
    .on("change", ({ value }) => store.setTierOverride(value === -1 ? null : value));

  // So "Auto" means something concrete when you are staring at it.
  const detected = { tier: "..." };
  const detectedBinding = perfFolder.addBinding(detected, "tier", {
    label: "detected",
    readonly: true,
  });
  store.resolveGPUTier().then(() => {
    detected.tier = String(store.gpuTier?.tier ?? "?");
    detectedBinding.refresh();
  });
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
    <Stats v-if="showDebug" />
    <CameraMouse />
    <Atmosphere />
    <Trees />
    <Suspense @resolve="onSceneChildResolve">
      <Smoke />
    </Suspense>
    <Precipitation />
    <Suspense @resolve="onSceneChildResolve">
      <Grass />
    </Suspense>
    <Suspense @resolve="onSceneChildResolve">
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
