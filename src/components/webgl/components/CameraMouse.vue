<script setup>
import { useLoop, useTresContext } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { computed, shallowRef, watch } from "vue";
import { useMainStore } from "@/stores";
import gsap from "gsap";

const store = useMainStore();
const { camera } = useTresContext();

watch(
  () => store.isHovered,
  (newVal) => {
    if (newVal) {
      gsap.to(camera.value, {
        fov: 35,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          camera.value.updateProjectionMatrix();
        },
      });
    } else {
      gsap.to(camera.value, {
        fov: 45,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          camera.value.updateProjectionMatrix();
        },
      });
    }
  }
);

const { x, y } = useMouse();
const { width, height } = useWindowSize();

const cameraGroupRef = shallowRef();
const _factor = 0.5;
const _ease = 1.5;

const cursorX = computed(() => -(x.value / width.value - 0.5) * _factor);
const cursorY = computed(() => -(y.value / height.value - 0.5) * _factor);

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed, delta }) => {
  const xMove = (cursorX.value - camera.value.rotation.y) * delta * _ease;
  const yMove = (cursorY.value - camera.value.rotation.x) * delta * _ease;
  camera.value.rotation.x +=  yMove;
  camera.value.rotation.x = Math.max(-0.25, Math.min(0.25, camera.value.rotation.x));
  camera.value.rotation.y += xMove;
  camera.value.rotation.y = Math.max(-0.25, Math.min(0.25, camera.value.rotation.y));
  camera.value.position.y = 5 + Math.sin(elapsed * 4) * 0.3;
});
</script>

<template>
  <TresGroup ref="cameraGroupRef" />
</template>
