<script setup>
import { useLoop, useTresContext } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { computed, shallowRef } from "vue";

const { camera } = useTresContext();

const { x, y } = useMouse();
const { width, height } = useWindowSize();

const cameraGroupRef = shallowRef();
const _factor = 0.5;
const _ease = 1.5;

const cursorX = computed(() => -(x.value / width.value - 0.5) * _factor);
const cursorY = computed(() => -(y.value / height.value - 0.5) * _factor);

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed, delta }) => {
  camera.value.rotation.y += (cursorX.value - camera.value.rotation.y) * delta * _ease;
  camera.value.rotation.x += ((cursorY.value) - camera.value.rotation.x) * delta * _ease;
  camera.value.position.y = 5 + Math.sin(elapsed * 4)  * 0.5;
  // camera.value.position.y = 5  * 2;
  // console.log(camera.value.position.z);
});
</script>

<template>
  <TresGroup ref="cameraGroupRef" />
</template>
