<script setup>
import { useTresContext } from "@tresjs/core";
import { Audio, AudioListener, AudioLoader } from "three";
import { nextTick, onMounted } from "vue";

const { camera } = useTresContext();

// create an AudioListener and add it to the camera
const listener = new AudioListener();
camera.value.add(listener);
// create a global audio source
const sound = new Audio(listener);
// load a sound and set it as the Audio object's buffer
const audioLoader = new AudioLoader();

onMounted(async () => {
    await nextTick();
  window.addEventListener(
    "pointerdown",
    async () => {
      if (!sound.isPlaying) {
        audioLoader.load("/assets/sounds/whistle.mp3", function (buffer) {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(0.25);
          sound.play();
        });
      }
    },
    { once: true }
  );
});
</script>
<template>
  <TresGroup />
</template>
