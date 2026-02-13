<script setup>
import { shallowRef, watch, reactive, onMounted } from "vue";
import { useTres, useLoop } from "@tresjs/core";
import { useMouse, useWindowSize } from "@vueuse/core";
import { Object3D, Plane, Raycaster, Vector2, Vector3 } from "three";
import { usePaneStore } from "@/stores/pane";

const store = usePaneStore();

const options = reactive({
  // ambientLight
  ambientIntensity: 0.8,
  ambientVisible: true,
  ambientColor: "#77A2E8",
  // directionalLight
  directionalIntensity: 0.75,
  directionalVisible: true,
  directionalColor: "#ccc",
  directionalPosition: { x: 0, y: 5, z: -50 },
  // spotLight
  spotIntensity: 1250,
  spotVisible: true,
  spotColor: "#FFFFFF",
  spotPosition: { x: 0, y: 5, z: 25 },
  spotDecay: 1.5,
  spotAngle: 0.12,
  spotPenumbra: 0.21,
});

onMounted(() => {
  if (!window.location.href.includes("#debug")) return;
  const pane = store.pane;
  const folder = pane.addFolder({ title: "Lights", expanded: false });

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
    max: 20,
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

const { scene, camera, renderer } = useTres();
const spotLightRef = shallowRef(null);
const { x, y } = useMouse();
const { width, height } = useWindowSize();

const targetObject = new Object3D();
scene.value.add(targetObject);

const raycaster = new Raycaster();
const mouseNdc = new Vector2();
const hitPoint = new Vector3();
const targetPlane = new Plane(new Vector3(0, 0, 1), 25);

const updateSpotTarget = (mouseX, mouseY) => {
  if (!camera.value) return;
  const domElement = renderer.value?.domElement;
  const rect = domElement?.getBoundingClientRect?.();
  const left = rect?.left ?? 0;
  const top = rect?.top ?? 0;
  const w = rect?.width ?? width.value;
  const h = rect?.height ?? height.value;
  const nx = (mouseX - left) / w;
  const ny = (mouseY - top) / h;
  mouseNdc.set(nx * 2 - 1, -(ny * 2 - 1));

  raycaster.setFromCamera(mouseNdc, camera.value);
  if (raycaster.ray.intersectPlane(targetPlane, hitPoint)) {
    targetObject.position.copy(hitPoint);
  }
};

watch(
  () => [x.value, y.value],
  ([newX, newY]) => {
    updateSpotTarget(newX, newY);
  },
  { immediate: true }
);

watch(
  spotLightRef,
  (light) => {
    if (light) {
      light.target = targetObject;
      updateSpotTarget(x.value, y.value);
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
