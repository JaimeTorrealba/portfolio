<script setup>
import { useLoop, useTres } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { computed, reactive, onMounted } from "vue";
import { usePaneStore } from "@/stores/pane";

const paneStore = usePaneStore();
const { camera } = useTres();

const options = reactive({
  factor: 0.25,
  ease: 2.5,
  headbobIntensity: 0.3,
  headbobFrequency: 4,
  headbobEnabled: true,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = paneStore.pane;
  const folder = pane.addFolder({ title: "Camera Mouse", expanded: false });

  folder.addBinding(options, "factor", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "ease", { min: 0, max: 10, step: 0.1 });
  folder.addBinding(options, "headbobIntensity", { min: 0, max: 1, step: 0.01 });
  folder.addBinding(options, "headbobFrequency", { min: 0, max: 20, step: 0.5 });
  folder.addBinding(options, "headbobEnabled");
});


const { x, y } = useMouse();
const { width, height } = useWindowSize();

const cursorX = computed(() => -(x.value / width.value - 0.5) * options.factor);
const cursorY = computed(() => -(y.value / height.value - 0.5) * options.factor);

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed, delta }) => {
  const xMove = (cursorX.value - camera.value.rotation.y) * delta * options.ease;
  const yMove = (cursorY.value - camera.value.rotation.x) * delta * options.ease;
  camera.value.rotation.x +=  yMove;
  camera.value.rotation.x = Math.max(-0.25, Math.min(0.25, camera.value.rotation.x));
  camera.value.rotation.y += xMove;
  camera.value.rotation.y = Math.max(-0.25, Math.min(0.25, camera.value.rotation.y));
  if (options.headbobEnabled) {
    camera.value.position.y = 5 + Math.sin(elapsed * options.headbobFrequency) * options.headbobIntensity;
  }
});
</script>

<template>
  <TresGroup />
</template>
