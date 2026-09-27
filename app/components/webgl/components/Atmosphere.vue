<script setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";
import { useLoop, useTres } from "@tresjs/core";
import { Color, Vector2, Vector3 } from "three";
import {
  Fn,
  uniform,
  fog,
  rangeFogFactor,
  positionWorld,
  cameraPosition,
  normalize,
  dot,
  mix,
  smoothstep,
  sin,
  float,
} from "three/tsl";
import { usePaneStore } from "@/stores/pane";
import { useMainStore } from "@/stores";

// Owns the scene fog. This replaces the <TresFog> that used to live in
// theExperience.vue: scene.fogNode takes precedence over scene.fog, so leaving both
// in place would just have been a second, dead set of near/far numbers to keep in
// sync. Materials that opt out with `fog = false` -- Moon, Clouds, Smoke -- are
// still skipped, because NodeMaterial only reaches the fog stage when material.fog
// is true.
const mainStore = useMainStore();
const { scene } = useTres();

// Must match the moon in Moon.vue. Only the direction matters here, and at 475
// units out it is effectively a fixed one, so this is not worth wiring up live.
const MOON_POSITION = new Vector3(0, 45, -450);

const options = reactive({
  near: 8,
  far: 95,
  colour: "#111111",
  // How much fog survives above `top`. Below 1 the air thins out with height.
  aloft: 0.35,
  ground: -2,
  top: 26,
  // Depth of the drifting patchiness, and how large the patches are.
  patchiness: 0.5,
  patchScale: 0.055,
  drift: 0.06,
  // Colour the mist takes when you look toward the moon, and how tightly that is
  // focused around it.
  moonColour: "#3f4c66",
  scatter: 0.2,
  scatterFocus: 2,
});

const uRange = uniform(new Vector2(options.near, options.far));
const uHeight = uniform(new Vector2(options.ground, options.top));
// x = fog remaining aloft, y = patch depth, z = patch scale.
const uShape = uniform(new Vector3(options.aloft, options.patchiness, options.patchScale));
const uScatter = uniform(new Vector2(options.scatter, options.scatterFocus));
const uFogColour = uniform(new Color(options.colour));
const uMoonColour = uniform(new Color(options.moonColour));
const uMoonDir = uniform(new Vector3(0, 0, -1));
const uTime = uniform(0);

scene.value.fogNode = Fn(() => {
  // Same smoothstep the built-in range fog used, so the starting point matches
  // what was there before.
  const dist = rangeFogFactor(uRange.x, uRange.y);

  // Mist pools on the ground. A flat depth curtain dims the moon and the far
  // treetops by exactly as much as it dims the grass, which is what made distance
  // read as a grey wall instead of air.
  const settle = smoothstep(uHeight.y, uHeight.x, positionWorld.y);
  const heightTerm = mix(uShape.x, 1.0, settle);

  // Drifting patchiness. Two sines beating against each other is all the eye needs
  // to read "uneven", and it costs nothing next to a noise fetch per fragment.
  const patch = sin(positionWorld.x.mul(uShape.z).add(uTime))
    .mul(sin(positionWorld.z.mul(uShape.z.mul(0.77)).sub(uTime.mul(0.6))))
    .mul(0.5)
    .add(0.5);
  const patchTerm = mix(float(1.0).sub(uShape.y), 1.0, patch);

  // Every term is already inside 0..1 given the pane ranges, so no clamp is needed.
  const factor = dist.mul(heightTerm).mul(patchTerm);

  // Mist lit from the moon: looking toward it, the fog scatters its light back at
  // you and goes noticeably brighter, while the rest of the sky stays flat. This is
  // the biggest night cue available for the price of a dot product.
  const toFragment = normalize(positionWorld.sub(cameraPosition));
  const scatter = dot(toFragment, uMoonDir).max(0.0).pow(uScatter.y).mul(uScatter.x);

  return fog(mix(uFogColour, uMoonColour, scatter), factor);
})();

watch(
  () => [options.near, options.far],
  () => uRange.value.set(options.near, options.far)
);
watch(
  () => [options.ground, options.top],
  () => uHeight.value.set(options.ground, options.top)
);
watch(
  () => [options.aloft, options.patchiness, options.patchScale],
  () => uShape.value.set(options.aloft, options.patchiness, options.patchScale)
);
watch(
  () => [options.scatter, options.scatterFocus],
  () => uScatter.value.set(options.scatter, options.scatterFocus)
);
watch(() => options.colour, (v) => uFogColour.value.set(v));
watch(() => options.moonColour, (v) => uMoonColour.value.set(v));

const { camera } = useTres();
const moonDir = new Vector3();

const syncMoonDir = () => {
  if (!camera.value) return;
  moonDir.copy(MOON_POSITION).sub(camera.value.position).normalize();
  uMoonDir.value.copy(moonDir);
};
syncMoonDir();

const { onBeforeRender } = useLoop();
onBeforeRender(({ elapsed }) => {
  // Frozen at 0, which is a valid still patch pattern.
  if (mainStore.reducedMotion) return;
  uTime.value = elapsed * options.drift;
  syncMoonDir();
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = usePaneStore().pane;
  const folder = pane.addFolder({ title: "Atmosphere", expanded: false });

  const rangeFolder = folder.addFolder({ title: "Range" });
  rangeFolder.addBinding(options, "near", { min: 0, max: 100, step: 1 });
  rangeFolder.addBinding(options, "far", { min: 10, max: 400, step: 1 });
  rangeFolder.addBinding(options, "colour");

  const mistFolder = folder.addFolder({ title: "Ground Mist" });
  mistFolder.addBinding(options, "aloft", { min: 0, max: 1, step: 0.01 });
  mistFolder.addBinding(options, "ground", { min: -20, max: 20, step: 0.5 });
  mistFolder.addBinding(options, "top", { min: 0, max: 80, step: 0.5 });
  mistFolder.addBinding(options, "patchiness", { min: 0, max: 1, step: 0.01 });
  mistFolder.addBinding(options, "patchScale", { min: 0.005, max: 0.3, step: 0.005 });
  mistFolder.addBinding(options, "drift", { min: 0, max: 0.5, step: 0.005 });

  const moonFolder = folder.addFolder({ title: "Moon Scatter" });
  moonFolder.addBinding(options, "moonColour");
  moonFolder.addBinding(options, "scatter", { min: 0, max: 2, step: 0.01 });
  moonFolder.addBinding(options, "scatterFocus", { min: 1, max: 40, step: 0.5 });
});

onUnmounted(() => {
  scene.value.fogNode = null;
});
</script>

<template>
  <TresGroup />
</template>
