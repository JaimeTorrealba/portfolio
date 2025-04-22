<script setup>
import { shallowRef, watch, ref } from "vue";
import { useLoop } from "@tresjs/core";
import gsap from "gsap";

defineProps({
  scaleFactor: Number,
  model: Object,
});

const emit = defineEmits(["clickModel"]);

const modelRef = shallowRef(null);
const spotLightRef = shallowRef(null);

watch(modelRef, (book) => {
  book.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
});

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  if (modelRef.value && !hasMouse.value) {
    modelRef.value.rotation.y = ((elapsed * 0.5) % Math.PI) * 2;
  }
});

const hasMouse = ref(false);
const onMouseEnter = () => {
  if (!hasMouse.value) {
    const toRotate = modelRef.value.rotation.y < Math.PI ? 0 : Math.PI * 2;
    gsap.to(modelRef.value.rotation, { y: toRotate, duration: 0.3 });
    document.body.style.cursor = "pointer";
  }
  hasMouse.value = true;
};
const onMouseLeave = () => {
  if (hasMouse.value) {
    document.body.style.cursor = "";
  }
  hasMouse.value = false;
};

const onClick = () => {
  //TODO: add more animations and effect maybe sounds
  gsap.to(spotLightRef.value, {
    intensity: 0,
    duration: 0.75,
    onComplete: () => {
      emit("clickModel");
    },
  });
};
</script>
<template>
  <primitive
    @pointer-enter="onMouseEnter"
    @pointer-leave="onMouseLeave"
    @click="onClick"
    ref="modelRef"
    name="necronomicon"
    :scale="5"
    :position="[0, 2.5 * scaleFactor, 3]"
    :object="model"
  />

  <TresSpotLight
    ref="spotLightRef"
    cast-shadow
    color="#F5EBD4"
    :intensity="25"
    :penumbra="1"    :angle="Math.PI * 0.4"
    :decay="1.25"
    :position="[-4, 10, 4]"
  />
</template>
