<script setup>
import { ref, shallowRef, watch } from "vue";
import { useLoop } from "@tresjs/core";
import { Precipitation, Stats } from "@tresjs/cientos";
import { RepeatWrapping } from "three";
import { useMainStore } from "@/stores";
import "three-hex-tiling";
import Smoke from "./Smoke.vue";
import Trees from "./Trees.vue";
// import Sound from "./Sound.vue";
import Grass from "./Grass.vue";

const props = defineProps({
  startParticle: Object,
  floorTextures: Object,
});

const store = useMainStore();
const soundRef = shallowRef(null);

watch(soundRef, (sound) => {
  if (sound) {
    store.soundElement = sound.instance;
  }
});

const setDefaultTextures = (obj, repeat = [4, 4]) => {
  Object.keys(obj).map((key) => {
    if (obj[key]?.isTexture) {
      obj[key].repeat.set(repeat[0], repeat[1]);
      obj[key].wrapS = RepeatWrapping;
      obj[key].wrapT = RepeatWrapping;
    }
  });
};

setDefaultTextures(props.floorTextures);

const hexTiling = {
  // default values shown
  patchScale: 2,
  useContrastCorrectedBlending: false,
  lookupSkipThreshold: 0.01,
  textureSampleCoefficientExponent: 1,
};

const floorMaterial = ref();

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  floorMaterial.value.map.offset.x = elapsed * -0.5;
  floorMaterial.value.normalMap.offset.x = elapsed * -0.5;
  floorMaterial.value.roughnessMap.offset.x = elapsed * -0.5;
  floorMaterial.value.aoMap.offset.x = elapsed * -0.5;
});
</script>
<template>
  <TresFog color="#111" near="8" far="100" />
  <!-- <Sound /> -->
  <Stats />
  <Precipitation
    :rotate-x="Math.PI * -0.5"
    :position="[0, 10, 10]"
    :area="[30, 30, 30]"
    :randomness="0"
    :count="100"
    :size="0.15"
    :color="0xffd700"
    :speed="store.isHovered ? 0.1 : 0.5"
    :opacity="0.8"
    :transparent="true"
    :alphaMap="startParticle"
  />
  <!-- FLOOR -->
  <TresMesh
    :position="[0, -3, -20]"
    :rotate-x="Math.PI * -0.5"
    :rotate-y="0"
    :rotate-z="Math.PI * -0.5"
    name="Floor"
  >
    <TresPlaneGeometry :args="[100, 25, 10, 10]" />
    <TresMeshPhysicalMaterial
      ref="floorMaterial"
      v-bind="floorTextures"
      :normal-scale="2"
      :roughness="0.75"
      :hexTiling="hexTiling"
    />
  </TresMesh>
  <Trees />
  <Suspense>
    <Smoke />
  </Suspense>
  <Grass />
</template>
