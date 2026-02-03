<script setup>
import { shallowRef, watch, reactive, onMounted } from "vue";
import { useTres, useLoop } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { Object3D } from "three";
import { usePaneStore } from "@/stores/pane";

const store = usePaneStore();

const options = reactive({
  // ambientLight
  ambientIntensity: 0.75,
  ambientVisible: true,
  ambientColor: "#6FA28B",
  // directionalLight
  directionalIntensity: 0.5,
  directionalVisible: true,
  directionalColor: "#B8CDE0",
  directionalPosition: { x: 0, y: 5, z: -50 },
  // spotLight
  spotIntensity: 1250,
  spotVisible: true,
  spotColor: "#B8CDE0",
  spotPosition: { x: 0, y: 5, z: 25 },
  spotDecay: 2,
  spotAngle: Math.PI * 0.1,
  spotPenumbra: 1,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Lights" });

  // Ambient Light
  const ambientFolder = folder.addFolder({ title: "Ambient Light" });
  ambientFolder.addBinding(options, "ambientVisible");
  ambientFolder.addBinding(options, "ambientIntensity", { min: 0, max: 20, step: 0.01 });
  ambientFolder.addBinding(options, "ambientColor");

  // Directional Light
  const directionalFolder = folder.addFolder({ title: "Directional Light" });
  directionalFolder.addBinding(options, "directionalVisible");
  directionalFolder.addBinding(options, "directionalIntensity", {
    min: 0,
    max: 2,
    step: 0.01,
  });
  directionalFolder.addBinding(options, "directionalColor");
  directionalFolder.addBinding(options, "directionalPosition", {
    x: { min: -50, max: 50, step: 1 },
    y: { min: -50, max: 50, step: 1 },
    z: { min: -100, max: 100, step: 1 },
  });

  // Spot Light
  const spotFolder = folder.addFolder({ title: "Spot Light" });
  spotFolder.addBinding(options, "spotVisible");
  spotFolder.addBinding(options, "spotIntensity", { min: 0, max: 5000, step: 10 });
  spotFolder.addBinding(options, "spotColor");
  spotFolder.addBinding(options, "spotPosition", {
    x: { min: -50, max: 50, step: 1 },
    y: { min: -50, max: 50, step: 1 },
    z: { min: -100, max: 100, step: 1 },
  });
  spotFolder.addBinding(options, "spotDecay", { min: 0, max: 5, step: 0.1 });
  spotFolder.addBinding(options, "spotAngle", { min: 0, max: Math.PI * 0.5, step: 0.01 });
  spotFolder.addBinding(options, "spotPenumbra", { min: 0, max: 1, step: 0.01 });
});

const { scene } = useTres();
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
    if (Math.random() > 0.995) {
      spotLightRef.value.intensity = 1;
    } else {
      spotLightRef.value.intensity = 1250;
    }
  }
});
</script>
<template>
  <TresSpotLight
    v-if="options.spotVisible"
    ref="spotLightRef"
    cast-shadow
    :color="options.spotColor"
    :intensity="options.spotIntensity"
    :penumbra="options.spotPenumbra"
    :angle="options.spotAngle"
    :decay="options.spotDecay"
    :position="[options.spotPosition.x, options.spotPosition.y, options.spotPosition.z]"
  />
  <TresAmbientLight
    v-if="options.ambientVisible"
    :color="options.ambientColor"
    :intensity="options.ambientIntensity"
  />
  <TresDirectionalLight
    v-if="options.directionalVisible"
    :color="options.directionalColor"
    :intensity="options.directionalIntensity"
    :position="[
      options.directionalPosition.x,
      options.directionalPosition.y,
      options.directionalPosition.z,
    ]"
  />
</template>
