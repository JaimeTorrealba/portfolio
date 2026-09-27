<script setup>
import { ref, onMounted, watch } from "vue";
import { useMainStore } from "@/stores";

const store = useMainStore();

const audio = new Audio('/walking-sound.mp3');
audio.loop = true;

const playing = ref(false);

onMounted(() => {
  // The loop is a walking sound: with the scene frozen there is nothing to be
  // walking through, so never arm the autoplay under reduced motion.
  if (store.reducedMotion) return;
  document.addEventListener('pointerdown', () => {
    if (store.reducedMotion) return;
    audio.play();
    playing.value = true;
  }, { once: true });
});

watch(() => store.reducedMotion, (reduce) => {
  if (!reduce) return;
  audio.pause();
  playing.value = false;
});

function toggle() {
  if (playing.value) {
    audio.pause();
    playing.value = false;
  } else {
    audio.play();
    playing.value = true;
  }
}
</script>

<template>
  <button
    v-if="!store.reducedMotion"
    @pointerdown.stop
    @click="toggle"
    class="sound-btn"
    :aria-label="playing ? 'Mute' : 'Unmute'"
  >
    <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  </button>
</template>

<style scoped>
.sound-btn {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.sound-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}
</style>
