<script setup>
import { ref, onMounted, watch } from "vue";
import { useMainStore } from "@/stores";

const store = useMainStore();

// Created on the first click rather than at load: the MP3 is large, and `new Audio()`
// starts downloading straight away, even for visitors who never hear it.
let walkingAudio = null;
const getWalkingAudio = () => {
  if (!walkingAudio) {
    walkingAudio = new Audio('/walking-sound.mp3');
    walkingAudio.loop = true;
  }
  return walkingAudio;
};

// Background music sits under the walking sound. The track is long enough that it
// plays once and ends instead of looping.
const MUSIC_VOLUME = 0.35;
let musicAudio = null;
const getMusicAudio = () => {
  if (!musicAudio) {
    musicAudio = new Audio('/ambient-piano.mp3');
    musicAudio.volume = MUSIC_VOLUME;
  }
  return musicAudio;
};

const playing = ref(false);

// play() rejects when the browser blocks playback; keep the button showing the truth.
// The music's own rejection is ignored: the walking sound drives the button state.
const startWalkingAudio = () => {
  playing.value = true;
  getWalkingAudio().play().catch(() => {
    playing.value = false;
  });
  getMusicAudio().play().catch(() => {});
};

const pauseAllAudio = () => {
  walkingAudio?.pause();
  musicAudio?.pause();
  playing.value = false;
};

// The click on "Full experience" is the user gesture browsers want before playing audio.
// A sync watcher calls play() inside that click rather than after it, which Safari needs.
watch(() => store.soundPreference, (preference, previous) => {
  if (previous === null && preference === 'on') startWalkingAudio();
}, { flush: 'sync' });

onMounted(() => {
  // The loop is a walking sound: with the scene frozen there is nothing to be
  // walking through, so never arm the autoplay under reduced motion.
  if (store.reducedMotion) return;
  // Only a reload with "on" already saved lands here: there was no click to play from,
  // so wait for the first one.
  if (store.soundPreference !== 'on') return;
  document.addEventListener('pointerdown', () => {
    if (store.reducedMotion || store.soundPreference !== 'on') return;
    startWalkingAudio();
  }, { once: true });
});

watch(() => store.reducedMotion, (reduce) => {
  if (!reduce) return;
  pauseAllAudio();
});

function toggle() {
  if (playing.value) {
    pauseAllAudio();
    store.setSoundPreference('off');
  } else {
    startWalkingAudio();
    store.setSoundPreference('on');
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
    <svg aria-hidden="true" focusable="false" v-if="playing" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
    <svg aria-hidden="true" focusable="false" v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
