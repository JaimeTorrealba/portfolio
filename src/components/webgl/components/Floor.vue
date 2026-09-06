<script setup>
import { watch, reactive, onMounted, onUnmounted } from "vue";
import { useLoop } from "@tresjs/core";
import { useTextures } from "@tresjs/cientos";
import { RepeatWrapping } from "three";
import { MeshPhysicalNodeMaterial } from "three/webgpu";
import { uv, smoothstep, uniform, texture, positionWorld, abs, mix, float } from "three/tsl";
import { usePaneStore } from '@/stores/pane'
import { useMainStore } from '@/stores'

const mainStore = useMainStore()

const options = reactive({
  stop: false,
  visibility: true,
  repeatTexS: 2,
  repeatTexT: 1,
  speed: 0.19,
  normalScale: 0.75,
  roughness: 1,
  fadeStart: 0.80,
  fadeEnd: 0.98,
  // Contact shading under the sward.
  grassShade: 0.3,
  grassShadeStart: 3.0,
  grassShadeEnd: 7.0,
});

// The plane's far edge used to land as a straight seam: fog alone never resolves
// the ground into the sky, because the cloud dome lifts the horizon above the fog
// colour, so the last stretch of floor stayed a few values off the background.
// Fading opacity over the far end lets the ground dissolve into whatever is behind
// it instead, whatever colour that happens to be.
const uFadeStart = uniform(options.fadeStart);
const uFadeEnd = uniform(options.fadeEnd);

// Grass.vue parks its two patches at x +/-14.5 with a +/-10 blade spread, so the
// sward starts around |x| = 4.5 and the lane between them is the only open ground.
// The lane texture used to run at full brightness right up to the blades, which is
// what made the grass look laid on top of the floor instead of growing out of it:
// there is no sky reaching the soil under a stand of grass that tall.
const uGrassShade = uniform(options.grassShade);
const uGrassShadeStart = uniform(options.grassShadeStart);
const uGrassShadeEnd = uniform(options.grassShadeEnd);

const material = new MeshPhysicalNodeMaterial();
material.transparent = true;
material.depthWrite = true;
// uv().y runs 0 at the near edge of the plane to 1 at the far edge.
material.opacityNode = smoothstep(uFadeStart, uFadeEnd, uv().y).oneMinus();

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const store = usePaneStore();
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Floor", expanded: false });
  folder.addBinding(options, "stop");
  folder.addBinding(options, "visibility");
  folder
    .addBinding(options, "repeatTexS", { min: 1, max: 10, step: 1 })
    .on("change", (ev) => {
      floorTextures.value.forEach((tex) => {
        tex.repeat.x = ev.value;
      });
    });
  folder
    .addBinding(options, "repeatTexT", { min: 1, max: 10, step: 1 })
    .on("change", (ev) => {
      floorTextures.value.forEach((tex) => {
        tex.repeat.y = ev.value;
      });
    });
  folder.addBinding(options, "speed", { min: 0, max: 1, step: 0.01 });

  folder
    .addBinding(options, "normalScale", { min: 0, max: 5, step: 0.1 })
    .on("change", (ev) => {
      material.normalScale.set(ev.value, ev.value);
    });
  folder
    .addBinding(options, "roughness", { min: 0, max: 1, step: 0.01 })
    .on("change", (ev) => {
      material.roughness = ev.value;
    });

  const contactFolder = folder.addFolder({ title: "Contact Shading" });
  contactFolder
    .addBinding(options, "grassShade", { min: 0, max: 1, step: 0.01 })
    .on("change", (ev) => {
      uGrassShade.value = ev.value;
    });
  contactFolder
    .addBinding(options, "grassShadeStart", { min: 0, max: 12, step: 0.1 })
    .on("change", (ev) => {
      uGrassShadeStart.value = ev.value;
    });
  contactFolder
    .addBinding(options, "grassShadeEnd", { min: 0, max: 12, step: 0.1 })
    .on("change", (ev) => {
      uGrassShadeEnd.value = ev.value;
    });

  const fadeFolder = folder.addFolder({ title: "Distance Fade" });
  fadeFolder
    .addBinding(options, "fadeStart", { min: 0, max: 1, step: 0.01 })
    .on("change", (ev) => {
      uFadeStart.value = ev.value;
    });
  fadeFolder
    .addBinding(options, "fadeEnd", { min: 0, max: 1, step: 0.01 })
    .on("change", (ev) => {
      uFadeEnd.value = ev.value;
    });
});

const { textures: floorTextures, isLoading: floorTexturesLoading } = useTextures([
  "/textures/floor/color.jpg",
  "/textures/floor/normal.jpg",
  "/textures/floor/roughness.jpg",
]);

watch(floorTextures, (newTextures) => {
  if (!newTextures?.length) return;
  newTextures.forEach((tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(options.repeatTexS, options.repeatTexT);
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI / 2;
  });

  material.map = newTextures[0];
  material.normalMap = newTextures[1];
  material.roughnessMap = newTextures[2];
  // texture() with no explicit uv picks up the map's own offset/repeat/rotation
  // matrix and keeps it updated, so the scroll in onBeforeRender still drives this.
  const swardMask = smoothstep(uGrassShadeStart, uGrassShadeEnd, abs(positionWorld.x));
  material.colorNode = texture(newTextures[0]).mul(mix(float(1.0), uGrassShade, swardMask));
  material.normalScale.set(options.normalScale, options.normalScale);
  material.roughness = options.roughness;
  material.needsUpdate = true;
}, { immediate: true });

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  if (!material.map || options.stop || mainStore.reducedMotion) return;
  const off = elapsed * options.speed;
  material.map.offset.x = material.normalMap.offset.x = material.roughnessMap.offset.x = off;
});

onUnmounted(() => {
  floorTextures.value?.forEach(t => t.dispose());
  material.dispose();
});
</script>
<template>
  <TresMesh
    v-if="!floorTexturesLoading"
    :position="[0, -2, -35]"
    :rotate-x="Math.PI * -0.5"
    :visible="options.visibility"
    :material="material"
  >
    <TresPlaneGeometry :args="[25, 130, 2, 2]" />
  </TresMesh>
</template>
