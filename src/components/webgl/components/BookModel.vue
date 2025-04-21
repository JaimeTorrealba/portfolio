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

watch(modelRef, (nail) => {
  nail.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
});

const { onBeforeRender, pause, resume } = useLoop();

onBeforeRender(({ elapsed }) => {
  if (modelRef.value) {
    modelRef.value.rotation.y = elapsed;
    modelRef.value.position.y = Math.sin(elapsed) + 3;
  }
});

const hasMouse = ref(false);
const onMouseEnter = () => {
  if (!hasMouse.value) {
    gsap.to(modelRef.value.rotation, { y: 0, duration: 0.3 });
    document.body.style.cursor = "pointer";
    pause();
  }
  hasMouse.value = true;
};
const onMouseLeave = () => {
  if (hasMouse.value) {
    document.body.style.cursor = "";
    resume();
  }
  hasMouse.value = false;
};

const onClick = () => {
    //TODO: add more animations and effect maybe sounds
    gsap.to(spotLightRef.value, { intensity: 0, duration: 0.75, onComplete: () => {
        emit('clickModel')
    } });
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
    :penumbra="1"
    :angle="Math.PI * 0.4"
    :decay="1.25"
    :position="[-4, 10, 4]"
  />
</template>
