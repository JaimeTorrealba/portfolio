<script setup>
import { reactive, onMounted, watch, shallowRef } from "vue";
import { Precipitation, useTexture } from "@tresjs/cientos";
import { usePaneStore } from "@/stores/pane";

const store = usePaneStore();

const options = reactive({
    visibility: true,
  speed: 0.25,
  size: 0.15,
  count: 200,
  opacity: 0.8,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Precipitation", expanded: false });
    folder.addBinding(options, "visibility");
  folder.addBinding(options, "speed", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "size", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "count", { min: 0, max: 1000, step: 1 });
  folder.addBinding(options, "opacity", { min: 0, max: 1, step: 0.01 });
});

const { state: startParticle, isLoading: startParticleLoading } = useTexture(
  "/textures/startParticle.png"
);

const pointRef = shallowRef();

watch(pointRef, (point) => {
  if (!point) return;
  point.texture = startParticle;
});
// TODO: fix on cientos Precipitation have problem accepting the texture on webGPU
// TODO: fix on cientos Precipitation size & count are not reactive
</script>
<template>
  <Precipitation
    ref="pointRef"
    v-if="options.visibility && !startParticleLoading"
    :rotate-x="Math.PI * -0.5"
    :position="[0, 10, 10]"
    :area="[20, 20, 20]"
    :randomness="1"
    :count="options.count"
    :size="options.size"
    :color="0xffd700"
    :speed="options.speed"
    :opacity="options.opacity"
    :transparent="true"
  />
</template>
