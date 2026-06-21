<script setup>
import { shallowRef, watch, reactive, onMounted, onUnmounted } from "vue";
import { useLoop } from "@tresjs/core";
import { useTextures } from "@tresjs/cientos";
import { RepeatWrapping } from "three";
import { usePaneStore } from '@/stores/pane'

const options = reactive({
  stop: false,
  visibility: true,
  repeatTexS: 2,
  repeatTexT: 1,
  speed: 0.24,
  normalScale: 0.75,
  roughness: 1,
});

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

  folder.addBinding(options, "normalScale", { min: 0, max: 5, step: 0.1 });
  folder.addBinding(options, "roughness", { min: 0, max: 1, step: 0.01 });
});

const { textures: floorTextures, isLoading: floorTexturesLoading } = useTextures([
  "/textures/floor/color.jpg",
  "/textures/floor/normal.jpg",
  "/textures/floor/roughness.jpg",
]);

watch(floorTextures, (newTextures) => {
  newTextures.forEach((tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(options.repeatTexS, options.repeatTexT);
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI / 2;
  });
});

const floorMaterial = shallowRef();

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  if (!floorMaterial.value || options.stop) return;
  const off = elapsed * options.speed;
  const m = floorMaterial.value;
  m.map.offset.x = m.normalMap.offset.x = m.roughnessMap.offset.x = off;
});

onUnmounted(() => {
  floorTextures.value?.forEach(t => t.dispose());
});
</script>
<template>
  <TresMesh
    v-if="!floorTexturesLoading"
    :position="[0, -2, -20]"
    :rotate-x="Math.PI * -0.5"
    :visible="options.visibility"
  >
    <TresPlaneGeometry :args="[25, 100, 2, 2]" />
    <TresMeshPhysicalMaterial
      ref="floorMaterial"
      :map="floorTextures[0]"
      :normal-map="floorTextures[1]"
      :roughness-map="floorTextures[2]"
      :normal-scale="options.normalScale"
      :roughness="options.roughness"
    />
  </TresMesh>
</template>
