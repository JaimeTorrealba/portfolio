<script setup>
import { useTresContext } from "@tresjs/core";
import { Precipitation } from "@tresjs/cientos";
import { RepeatWrapping } from "three";
import { Tree } from "@dgreenheck/ez-tree";
import Cloud from "./Cloud.vue";

const props = defineProps({
  startParticle: Object,
  floorTextures: Object,
  floor: Object,
});

const { scene } = useTresContext();
const _floor = props.floor.getObjectByName("Floor");

const setDefaultTextures = (obj, repeat = [2, 2]) => {
  Object.keys(obj).map((key) => {
    if (obj[key]?.isTexture) {
      obj[key].repeat.set(repeat[0], repeat[1]);
      obj[key].wrapS = RepeatWrapping;
      obj[key].wrapT = RepeatWrapping;
    }
  });
};

setDefaultTextures(props.floorTextures);

const createTree = (seed, position, scale) => {
  const tree = new Tree();
  tree.scale.set(scale, scale, scale);
  tree.position.set(position.x, position.y, position.z);
  tree.options.seed = seed;
  tree.options.leaves.size = 0;
  tree.generate();
  scene.value.add(tree);
  return tree;
};

// tree 1
createTree(12345, { x: -8, y: -3.1, z: -6 }, 1);
// tree 2
createTree(553, { x: 10, y: -3.1, z: -2 }, 1.5);
// tree 3
createTree(449, { x: 0, y: -3.1, z: -8 }, 1.32);
// tree 4
createTree(449, { x: -13, y: -3.1, z: 5 }, 1.16);
</script>
<template>
  <TresFog color="#111" near="8" far="40" />
  <Precipitation
    :rotation-z="Math.PI"
    :area="[30, 30, 30]"
    :randomness="50"
    :count="50"
    :size="0.25"
    :color="0xffd700"
    :speed="0.001"
    :opacity="0.8"
    :transparent="true"
    :alphaMap="startParticle"
  />
  <TresMesh :position-y="-3" :position-z="10"  receive-shadow name="Floor" :geometry="_floor.geometry">
    <TresMeshPhysicalMaterial
      v-bind="floorTextures"
      :normal-scale="5"
      :roughness="0.75"
    />
  </TresMesh>
  <Suspense>
    <Cloud :position="[0, 5, 0]" :scale="20" :speed="0.1" :opacity="0.25" />
  </Suspense>
</template>
