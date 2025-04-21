<script setup>
import { useLoop, useTresContext } from "@tresjs/core";
import { Precipitation, MouseParallax } from "@tresjs/cientos";
import { RepeatWrapping } from 'three'

const props = defineProps({
  startParticle: Object,
  floorTextures: Object,
  chainModel: Object
});

const chainModel1 = props.chainModel.clone()

const setDefaultTextures = (obj, repeat = [4, 4]) => {
  Object.keys(obj).map((key) => {
    if (obj[key]?.isTexture) {
      obj[key].repeat.set(repeat[0], repeat[1])
      obj[key].wrapS = RepeatWrapping
      obj[key].wrapT = RepeatWrapping
    }
  })
}

setDefaultTextures(props.floorTextures)

const { camera } = useTresContext();

const { onBeforeRender } = useLoop();
onBeforeRender(() => {
  camera.value.lookAt(0, 3.5, 0); // always look at the center of the scene
});
</script>
<template>
  <TresFog color="#111" near="8" far="40" />
  <MouseParallax :ease="1" :factor="5" />
  <Precipitation
    :rotation-z="Math.PI"
    :area="[30, 30, 30]"
    :randomness="50"
    :count="500"
    :size="0.25"
    :color="0xf7f7f7"
    :speed="0.001"
    :opacity="0.8"
    :transparent="true"
    :alphaMap="startParticle"
  />
  <TresAmbientLight color="#F5EBD4" :intensity="0.05" />
  <TresMesh :position-y="-0.25" :rotate-x="Math.PI * -0.5" receive-shadow name="Floor">
    <TresPlaneGeometry :args="[40, 40, 100, 100]" />
    <TresMeshPhysicalMaterial
      v-bind="floorTextures"
      :normal-scale="1"
      :displacement-scale="0.5"
    />
  </TresMesh>
  <TresGroup>
        <primitive :object="chainModel" :position="[6, -1, -4]" :rotation-z="Math.PI * 0.25" />
        <primitive :object="chainModel1" :position="[-6, -1, -4]" :rotation-z="-Math.PI * 0.25" />
    </TresGroup>
</template>
