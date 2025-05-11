<script setup>
import { useTresContext } from "@tresjs/core";
import { Precipitation } from "@tresjs/cientos";
import { RepeatWrapping } from 'three'
import { Tree } from "@dgreenheck/ez-tree";

const props = defineProps({
  startParticle: Object,
  floorTextures: Object,
});

const { scene } = useTresContext();


const setDefaultTextures = (obj, repeat = [8, 8]) => {
  Object.keys(obj).map((key) => {
    if (obj[key]?.isTexture) {
      obj[key].repeat.set(repeat[0], repeat[1])
      obj[key].wrapS = RepeatWrapping
      obj[key].wrapT = RepeatWrapping
    }
  })
}

setDefaultTextures(props.floorTextures)

// tree 1
const _tree1 = new Tree();
_tree1.position.y = -3.1;
_tree1.position.x = -8;
_tree1.position.z = -7;
_tree1.options.seed = 12345;
_tree1.options.leaves.size = 0;

_tree1.generate();
scene.value.add(_tree1);

// tree 2
const _tree2 = new Tree();
_tree2.scale.set(1.5, 1.5, 1.5);
_tree2.position.y = -3.1;
_tree2.position.x = 10;
_tree2.position.z = -2;
_tree2.options.seed = 553;
_tree2.options.leaves.size = 0;

_tree2.generate();
scene.value.add(_tree2);

// tree 3
const _tree3 = new Tree();
_tree3.scale.set(1.32, 1.32, 1.32);
_tree3.position.y = -3.1;
_tree3.position.x = 4;
_tree3.position.z = -11;
_tree3.options.seed = 449;
_tree3.options.leaves.size = 0;

_tree3.generate();
scene.value.add(_tree3);

// tree 4
const _tree4 = new Tree();
_tree4.scale.set(1.16, 1.16, 1.16);
_tree4.position.y = -3.1;
_tree4.position.x = -14;
_tree4.position.z = 5;
_tree4.options.seed = 449;
_tree4.options.leaves.size = 0;

_tree4.generate();
scene.value.add(_tree4);
</script>
<template>
  <TresFog color="#111" near="8" far="40" />
  <Precipitation
    :rotation-z="Math.PI"
    :area="[30, 30, 30]"
    :randomness="50"
    :count="50"
    :size="0.25"
    :color="0xFFD700"
    :speed="0.001"
    :opacity="0.8"
    :transparent="true"
    :alphaMap="startParticle"
  />
  <TresMesh :position-y="-3" :rotate-x="Math.PI * -0.5" receive-shadow name="Floor">
    <TresPlaneGeometry :args="[80, 80, 100, 100]" />
    <TresMeshPhysicalMaterial
      v-bind="floorTextures"
      :normal-scale="5"
      :roughness="0.75"
    />
  </TresMesh>
</template>
