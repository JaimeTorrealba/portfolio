<script setup>
import { ref, reactive, onMounted } from "vue";
import { useLoop } from "@tresjs/core";
import { usePaneStore } from "@/stores/pane";

const options = reactive({
  visibility: true,
  speed: 0.25,
  size: 0.15,
  count: 50,
  opacity: 0.8,
  randomness: 0.008,
});

const COUNT = options.count;
const AREA_X = 20;
const AREA_Y = 20;
const Z_NEAR = 15;
const Z_FAR = -45;

const positions = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * AREA_X;
  positions[i * 3 + 1] = (Math.random() - 0.5) * AREA_Y;
  positions[i * 3 + 2] = Math.random() * (Z_NEAR - Z_FAR) + Z_FAR;
}

const geoRef = ref();

const { onBeforeRender} = useLoop()

onBeforeRender(() => {
  if (!geoRef.value) return;
  const pos = geoRef.value.attributes.position.array;
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3 + 2] += options.speed;
    pos[i * 3]     += (Math.random() - 0.5) * options.randomness;
    pos[i * 3 + 1] += (Math.random() - 0.5) * options.randomness;
    if (pos[i * 3 + 2] > Z_NEAR) {
      pos[i * 3 + 2] = Z_FAR;
      pos[i * 3]     = (Math.random() - 0.5) * AREA_X;
      pos[i * 3 + 1] = (Math.random() - 0.5) * AREA_Y;
    }
  }
  geoRef.value.attributes.position.needsUpdate = true;
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const store = usePaneStore();
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Precipitation", expanded: false });
  folder.addBinding(options, "visibility");
  folder.addBinding(options, "speed", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "size", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "opacity", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "randomness", { min: 0, max: 0.1, step: 0.001 });
});
</script>

<template>
  <TresPoints v-if="options.visibility" :position="[0, 5, 0]">
    <TresBufferGeometry ref="geoRef">
      <TresBufferAttribute attach="attributes-position" :args="[positions, 3]" />
    </TresBufferGeometry>
    <TresPointsMaterial
      :size="options.size"
      :color="0xffd700"
      :opacity="options.opacity"
      :transparent="true"
      :size-attenuation="true"
      :depth-write="false"
    />
  </TresPoints>
</template>
