<script setup>
import { useLoop, useTexture, useTresContext } from "@tresjs/core";
import { computed, shallowRef, toRefs } from "vue";

const props = defineProps({
  opacity: {
    type: Number,
    default: 0.5,
  },
  speed: {
    type: Number,
    default: 0.4,
  },
  width: {
    type: Number,
    default: 10,
  },
  depth: {
    type: Number,
    default: 1.5,
  },
  segments: {
    type: Number,
    default: 20,
  },
  texture: {
    type: String,
    default:
      "https://raw.githubusercontent.com/Tresjs/assets/main/textures/clouds/defaultCloud.png",
  },
  color: {
    type: String,
    default: "#ffffff",
  },
  depthTest: {
    type: Boolean,
    default: true,
  },
});

const { texture, color, depthTest, speed } = toRefs(props);

const smokeRef = shallowRef();

const { map } = await useTexture({ map: texture.value });

const { renderer, camera } = useTresContext();
const colorSpace = computed(() => renderer.value?.outputColorSpace);

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  if (smokeRef.value && camera.value) {
      smokeRef.value.lookAt(camera.value?.position);
    smokeRef.value.rotation.z = elapsed * speed.value;
  }
});
</script>

<template>
  <TresMesh ref="smokeRef">
    <TresPlaneGeometry :rotation="[0, 0, 0]" />
    <TresMeshStandardMaterial
      :map="map"
      :depth-test="depthTest"
      :color-space="colorSpace"
      :color="color"
      :depth-write="false"
      transparent
      :opacity="opacity"
    />
  </TresMesh>
</template>
