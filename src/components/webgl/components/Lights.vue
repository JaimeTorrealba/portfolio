<script setup>
import { shallowRef, watch } from "vue";
import { useTresContext, useLoop } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { Object3D } from "three";

defineProps({
  scaleFactor: Number,
});

const { scene } = useTresContext();
const spotLightRef = shallowRef(null);
const { x, y } = useMouse();
const { width, height } = useWindowSize();

const targetObject = new Object3D();
scene.value.add(targetObject);

watch(
  () => [x.value, y.value],
  ([newX, newY]) => {
    if (spotLightRef.value) {
      // Calculate normalized device coordinates
      const ndcX = (newX / width.value) * 2 - 1;
      const ndcY = -(newY / height.value) * 2 + 1;
      const target = { x: ndcX * 20, y: ndcY * 20, z: -25 };

      targetObject.position.set(target.x, target.y, target.z);
      if (!spotLightRef.value.target) {
        spotLightRef.value.target = {};
      }
      spotLightRef.value.target = targetObject;
    }
  },
  { immediate: true }
);

const { onBeforeRender } = useLoop();

onBeforeRender(() => {
  if (spotLightRef.value) {
    if(Math.random() > 0.995) {
      spotLightRef.value.intensity = 1;
    } else {
      spotLightRef.value.intensity = 1250;
    }
  }
});
</script>
<template>
  <TresSpotLight
    ref="spotLightRef"
    cast-shadow
    color="#B8CDE0"
    :intensity="1250"
    :penumbra="1"
    :angle="Math.PI * 0.1"
    :decay="2"
    :position="[0, 5, 25]"
  />
  <TresAmbientLight color="#6FA28B" :intensity="0.75" />
  <TresDirectionalLight color="#B8CDE0" :intensity="0.05" :position="[0, 5, -50]" />
</template>
