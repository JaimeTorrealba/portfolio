<script setup>
import { shallowRef, watch, reactive, onMounted } from "vue";
import { useLoop } from "@tresjs/core";
import { useTextures } from "@tresjs/cientos";
import { RepeatWrapping } from "three";
import { usePaneStore } from '@/stores/pane'

const store = usePaneStore()

const options = reactive({
  stop: false,
  visibility: true,
  repeatTexS: 4,
  repeatTexT: 4,
  speed: 0.25,
  normalScale: 2,
  roughness: 0.75,
  aoMapIntensity: 1,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Floor" });
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
  folder.addBinding(options, "aoMapIntensity", { min: 0, max: 50, step: 0.1 });
});

const { textures: floorTextures, isLoading: floorTexturesLoading } = useTextures([
  "/textures/floor/floor.jpg",
  "/textures/floor/floor_nor.jpg",
  "/textures/floor/floor_rough.jpg",
  "/textures/floor/floor_ao.jpg",
]);

watch(floorTextures, (newTextures) => {
  newTextures.forEach((tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(options.repeatTexS, options.repeatTexT);
  });
});

const floorMaterial = shallowRef();

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  if (!floorMaterial.value || options.stop) return;
  floorMaterial.value.map.offset.y = elapsed * options.speed;
  floorMaterial.value.normalMap.offset.y = elapsed * options.speed;
  floorMaterial.value.roughnessMap.offset.y = elapsed * options.speed;
  floorMaterial.value.aoMap.offset.y = elapsed * options.speed;
});
</script>
<template>
  <TresMesh
    v-if="!floorTexturesLoading"
    :position="[0, -3, -20]"
    :rotate-x="Math.PI * -0.5"
    :visible="options.visibility"
  >
    <TresPlaneGeometry :args="[25, 100, 10, 10]" />
    <TresMeshPhysicalMaterial
      ref="floorMaterial"
      :map="floorTextures[0]"
      :ao-map="floorTextures[3]"
      :normal-map="floorTextures[1]"
      :roughness-map="floorTextures[2]"
      :normal-scale="options.normalScale"
      :roughness="options.roughness"
      :aoMap-intensity="options.aoMapIntensity"
    />
  </TresMesh>
</template>
