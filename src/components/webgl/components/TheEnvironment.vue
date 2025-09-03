<script setup>
import { ref } from "vue";
import { useTresContext, useLoop } from "@tresjs/core";
import { Precipitation } from "@tresjs/cientos";
import { RepeatWrapping } from "three";
import { Tree } from "@dgreenheck/ez-tree";
import { useMainStore } from "@/stores";
// import Cloud from "./Cloud.vue";
// import Grass from "./Grass.vue";

const props = defineProps({
  startParticle: Object,
  floorTextures: Object,
});

const { scene, camera } = useTresContext();
const store = useMainStore()

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

const createTree = (_x) => {
  const tree = new Tree();
  const randomScale = 2 + (Math.random() - 0.5);
  tree.scale.set(randomScale, randomScale, randomScale);
  tree.position.set(_x, -3.1, Math.random() * 40 - 100);
  tree.options.seed = Math.random() * 10000;
  tree.options.leaves.size = 0;
  tree.generate();
  trees.push(tree);
  scene.value.add(tree);
  return tree;
};

const trees = [];

createTree(Math.random() * 10 - 20);

setTimeout(() => {
  createTree(Math.random() * 10 + 10);
}, Math.random() * 5000);

const floorMaterial = ref();

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed, delta }) => {
  const multiplier = store.isHovered ? -0.1 : -0.5;
  floorMaterial.value.map.offset.x = elapsed * multiplier;
  floorMaterial.value.normalMap.offset.x = elapsed * multiplier;
  floorMaterial.value.roughnessMap.offset.x = elapsed * multiplier;
  floorMaterial.value.aoMap.offset.x = elapsed * multiplier;
  if (trees.length > 0) {
    trees.forEach((tree) => {
      const treeMultiplier = store.isHovered ? 2.5 : 12.5;
      tree.position.z += delta * treeMultiplier;
      if (tree.position.z > camera.value.position.z + 10) {
        scene.value.remove(tree);
        trees.splice(trees.indexOf(tree), 1);
        const leftRight = tree.position.x < 0 ? Math.random() * 10 - 20 : Math.random() * 10 + 10;
        createTree(leftRight);
      }
    });
  }
});
</script>
<template>
  <TresFog color="#111" near="8" far="100" />
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
    <TresPlaneGeometry :args="[100, 100, 10, 10]" />
    <TresMeshPhysicalMaterial
      ref="floorMaterial"
      v-bind="floorTextures"
      :normal-scale="5"
      :roughness="0.75"
    />
  </TresMesh>
  <!-- <Suspense> -->
    <!-- Clouds move to z25 to remove temporarily from the view -->
    <!-- <Cloud :position="[0, 5, 25]" :scale="20" :speed="0.1" :opacity="0.25" /> -->
  <!-- </Suspense> -->
  <!-- <Grass :position="[22, -3.3, -20]" />
  <Grass :position="[-22, -3.3, -20]" /> -->
</template>
